import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  loadWinterArcData,
  saveWinterArcData,
  createEmptyWinterArcState,
  calculateCurrentDayNumber,
  calculateDailyScore,
  calculateLevel,
  exportDataAsJSON,
  getDateForDay,
  formatReadableDate,
  getDayOfWeekKey,
  getDayOfWeekName,
  getNextIncompleteTopic,
  createRevisionSchedule,
  getLastPerformanceForExercise,
  buildAutomatedDayPlan,
  ORDERED_WEEKDAYS,
} from '../utils/storage';
import {
  requestNotificationPermission,
  sendContextualNotification,
  getContextualNotificationMessage,
  getNotificationPermissionStatus,
} from '../utils/notifications';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadWinterArcData());
  const currentDayNumber = useMemo(() => calculateCurrentDayNumber(), []);
  const [activeDayNumber, setActiveDayNumber] = useState(currentDayNumber);
  const [toasts, setToasts] = useState([]);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState('task');

  // Persistence to LocalStorage
  useEffect(() => {
    saveWinterArcData(data);
  }, [data]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const isFutureDay = useCallback((dayNum) => {
    return dayNum > currentDayNumber;
  }, [currentDayNumber]);

  // Log XP with audit history
  const awardXp = useCallback((amount, actionDescription) => {
    if (!amount || amount <= 0) return;
    setData(prev => {
      const newXp = (prev.stats?.totalXp || 0) + amount;
      const historyItem = {
        id: `xp-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: getDateForDay(activeDayNumber),
        amount,
        action: actionDescription,
      };

      // Check achievements
      const updatedAchievements = (prev.achievements || []).map(ach => {
        if (ach.unlocked) return ach;
        let unlocked = false;
        if (ach.id === 'first_habit' && actionDescription.includes('Habit')) unlocked = true;
        if (ach.id === 'first_workout' && actionDescription.includes('Workout')) unlocked = true;
        if (ach.id === 'first_study' && actionDescription.includes('Study')) unlocked = true;
        if (ach.id === 'first_code' && actionDescription.includes('Coding')) unlocked = true;
        if (ach.id === 'first_journal' && actionDescription.includes('Journal')) unlocked = true;

        if (unlocked) {
          showToast(`Achievement Unlocked: ${ach.title}!`, 'success');
          return { ...ach, unlocked: true, unlockedAt: `Day ${currentDayNumber}` };
        }
        return ach;
      });

      return {
        ...prev,
        achievements: updatedAchievements,
        stats: {
          ...prev.stats,
          totalXp: newXp,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
  }, [activeDayNumber, currentDayNumber, showToast]);

  // COMPLETE / TOGGLE TASK
  const toggleTask = useCallback((taskId, dayNum = activeDayNumber) => {
    if (isFutureDay(dayNum)) {
      showToast('Future days cannot be edited.', 'warning');
      return;
    }

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const tasks = day.tasks || [];
      const target = tasks.find(t => t.id === taskId);
      if (!target) return prev;

      const willBeCompleted = !target.completed;
      const xpVal = target.xp || 10;

      const updatedTasks = tasks.map(t =>
        t.id === taskId ? { ...t, completed: willBeCompleted, status: willBeCompleted ? 'completed' : 'pending' } : t
      );
      const isRest = prev.routine?.[getDayOfWeekKey(day.date)]?.isRestDay;
      const updatedDay = { ...day, tasks: updatedTasks };
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      // Update day status
      if (total >= 70) updatedDay.status = 'completed';
      else if (dayNum === currentDayNumber) updatedDay.status = 'current';

      const xpDelta = willBeCompleted ? xpVal : -xpVal;
      const historyItem = willBeCompleted ? {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: getDateForDay(dayNum),
        amount: xpVal,
        action: `Task: ${target.title}`,
      } : null;

      const nextHistory = historyItem
        ? [historyItem, ...(prev.xpHistory || []).slice(0, 49)]
        : (prev.xpHistory || []);

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
        stats: {
          ...prev.stats,
          totalXp: Math.max(0, (prev.stats?.totalXp || 0) + xpDelta),
        },
        xpHistory: nextHistory,
      };
    });
  }, [activeDayNumber, currentDayNumber, isFutureDay, showToast]);

  // SKIP TASK
  const skipTask = useCallback((taskId, dayNum = activeDayNumber) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot modify future tasks.', 'warning');
      return;
    }
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const tasks = (day.tasks || []).map(t =>
        t.id === taskId ? { ...t, status: 'skipped', completed: false } : t
      );
      const isRest = prev.routine?.[getDayOfWeekKey(day.date)]?.isRestDay;
      const updatedDay = { ...day, tasks };
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;
      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
      };
    });
    showToast('Task marked as skipped', 'info');
  }, [activeDayNumber, isFutureDay, showToast]);

  // RESCHEDULE TASK
  const rescheduleTask = useCallback((taskId, dayNum = activeDayNumber, newTime = '18:00') => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot modify future tasks.', 'warning');
      return;
    }
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const tasks = (day.tasks || []).map(t =>
        t.id === taskId ? { ...t, time: newTime, status: 'pending' } : t
      );
      return {
        ...prev,
        days: { ...prev.days, [dayNum]: { ...day, tasks } },
      };
    });
    showToast(`Task rescheduled to ${newTime}`, 'success');
  }, [activeDayNumber, isFutureDay, showToast]);

  // EDIT TASK
  const editTask = useCallback((taskId, dayNum = activeDayNumber, updates = {}) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot modify future tasks.', 'warning');
      return;
    }
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const tasks = (day.tasks || []).map(t =>
        t.id === taskId ? { ...t, ...updates } : t
      );
      const isRest = prev.routine?.[getDayOfWeekKey(day.date)]?.isRestDay;
      const updatedDay = { ...day, tasks };
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;
      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
      };
    });
    showToast('Task updated', 'success');
  }, [activeDayNumber, isFutureDay, showToast]);

  // DELETE TASK
  const deleteTask = useCallback((taskId, dayNum = activeDayNumber) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot delete tasks on future days.', 'warning');
      return;
    }
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const tasks = (day.tasks || []).filter(t => t.id !== taskId);
      const isRest = prev.routine?.[getDayOfWeekKey(day.date)]?.isRestDay;
      const updatedDay = { ...day, tasks };
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;
      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
      };
    });
    showToast('Task deleted', 'info');
  }, [activeDayNumber, isFutureDay, showToast]);

  // ADD CUSTOM TASK
  const addTask = useCallback((dayNum, task) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot add tasks to future days.', 'warning');
      return;
    }

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const tasks = day.tasks || [];
      const newTask = {
        id: `t-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: task.title,
        time: task.time || '12:00',
        category: task.category || 'focus',
        completed: false,
        status: 'pending',
        xp: Number(task.xp) || 15,
      };
      const isRest = prev.routine?.[getDayOfWeekKey(day.date)]?.isRestDay;
      const updatedDay = { ...day, tasks: [...tasks, newTask] };
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
      };
    });
    showToast('Task added', 'success');
  }, [isFutureDay, showToast]);

  // SYNC / REGENERATE AUTOMATED DAY PLAN (Preserves user completed/custom items)
  const syncAutomatedDayPlan = useCallback((dayNum = activeDayNumber) => {
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const dateStr = getDateForDay(dayNum);
      const automated = buildAutomatedDayPlan(
        dayNum,
        dateStr,
        prev.routine,
        prev.courses,
        prev.codingConfig,
        prev.habits,
        prev.revisions
      );

      const existingTasks = day.tasks || [];
      // Keep track of which automated task types already have a completed match
      const mergedTasks = automated.map(autoTask => {
        const match = existingTasks.find(e =>
          e.id === autoTask.id || (e.category === autoTask.category && e.title.startsWith(autoTask.title.slice(0, 15)))
        );
        if (match) {
          return {
            ...autoTask,
            id: match.id,
            completed: match.completed,
            status: match.status || (match.completed ? 'completed' : 'pending'),
          };
        }
        return autoTask;
      });

      // Also append any purely custom user tasks that were added
      const customTasks = existingTasks.filter(e => !e.isAutomated && !mergedTasks.some(m => m.id === e.id));
      const finalTasks = [...mergedTasks, ...customTasks];

      const isRest = prev.routine?.[getDayOfWeekKey(dateStr)]?.isRestDay;
      const updatedDay = { ...day, tasks: finalTasks };
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
      };
    });
  }, [activeDayNumber]);

  // HABITS
  const addHabit = useCallback((newHabit) => {
    setData(prev => {
      const habit = {
        id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: newHabit.title || 'New Habit',
        category: newHabit.category || 'Discipline',
        streak: 0,
        createdAt: new Date().toISOString(),
      };
      return {
        ...prev,
        habits: [...(prev.habits || []), habit],
      };
    });
    showToast('Habit added', 'success');
  }, [showToast]);

  const toggleHabit = useCallback((habitId, dayNum = activeDayNumber) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot check habits for future dates.', 'warning');
      return;
    }

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const completedList = day.habitsCompleted || [];
      const isAlreadyCompleted = completedList.includes(habitId);

      const nextCompletedList = isAlreadyCompleted
        ? completedList.filter(id => id !== habitId)
        : [...completedList, habitId];

      const updatedHabits = (prev.habits || []).map(h => {
        if (h.id === habitId) {
          const newStreak = isAlreadyCompleted ? Math.max(0, (h.streak || 1) - 1) : (h.streak || 0) + 1;
          return { ...h, streak: newStreak };
        }
        return h;
      });

      const xpAmount = isAlreadyCompleted ? -10 : 10;
      const habitObj = prev.habits?.find(h => h.id === habitId);
      const historyItem = !isAlreadyCompleted ? {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: getDateForDay(dayNum),
        amount: 10,
        action: `Habit: ${habitObj?.title || 'Habit completed'}`,
      } : null;

      const nextHistory = historyItem
        ? [historyItem, ...(prev.xpHistory || []).slice(0, 49)]
        : (prev.xpHistory || []);

      return {
        ...prev,
        habits: updatedHabits,
        days: {
          ...prev.days,
          [dayNum]: { ...day, habitsCompleted: nextCompletedList },
        },
        stats: {
          ...prev.stats,
          totalXp: Math.max(0, (prev.stats?.totalXp || 0) + xpAmount),
        },
        xpHistory: nextHistory,
      };
    });
  }, [activeDayNumber, isFutureDay, showToast]);

  const deleteHabit = useCallback((habitId) => {
    setData(prev => ({
      ...prev,
      habits: (prev.habits || []).filter(h => h.id !== habitId),
    }));
    showToast('Habit removed', 'info');
  }, [showToast]);

  // ROUTINE PLANNER & WORKOUT SCHEDULE
  const updateDayRoutine = useCallback((weekdayKey, updates) => {
    setData(prev => {
      const currentRoutine = prev.routine || {};
      const dayData = currentRoutine[weekdayKey] || {
        workoutFocus: '',
        exercises: [],
        courseId: '',
        codingLang: '',
        other: '',
        isRestDay: false,
      };

      const updatedDayData = { ...dayData, ...updates };
      const nextRoutine = { ...currentRoutine, [weekdayKey]: updatedDayData };

      return {
        ...prev,
        routine: nextRoutine,
      };
    });
    showToast(`${weekdayKey.charAt(0).toUpperCase() + weekdayKey.slice(1)} routine saved`, 'success');
  }, [showToast]);

  const updateWeeklyRoutine = useCallback((fullRoutine) => {
    setData(prev => ({
      ...prev,
      routine: fullRoutine,
    }));
    showToast('Weekly routine updated', 'success');
  }, [showToast]);

  const addExerciseToRoutine = useCallback((weekdayKey, exercise) => {
    setData(prev => {
      const currentRoutine = prev.routine || {};
      const dayData = currentRoutine[weekdayKey] || { workoutFocus: '', exercises: [] };
      const newEx = {
        id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: exercise.name || 'Exercise',
        sets: Number(exercise.sets) || 3,
        reps: Number(exercise.reps) || 10,
        weight: Number(exercise.weight) || 0,
        restTime: Number(exercise.restTime) || 60,
      };
      const updatedDayData = {
        ...dayData,
        exercises: [...(dayData.exercises || []), newEx],
      };
      return {
        ...prev,
        routine: { ...currentRoutine, [weekdayKey]: updatedDayData },
      };
    });
    showToast('Exercise added to routine', 'success');
  }, [showToast]);

  const editExerciseInRoutine = useCallback((weekdayKey, exerciseId, updates) => {
    setData(prev => {
      const currentRoutine = prev.routine || {};
      const dayData = currentRoutine[weekdayKey] || { exercises: [] };
      const updatedExercises = (dayData.exercises || []).map(ex =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      );
      return {
        ...prev,
        routine: {
          ...currentRoutine,
          [weekdayKey]: { ...dayData, exercises: updatedExercises },
        },
      };
    });
    showToast('Exercise updated', 'success');
  }, [showToast]);

  const deleteExerciseFromRoutine = useCallback((weekdayKey, exerciseId) => {
    setData(prev => {
      const currentRoutine = prev.routine || {};
      const dayData = currentRoutine[weekdayKey] || { exercises: [] };
      const updatedExercises = (dayData.exercises || []).filter(ex => ex.id !== exerciseId);
      return {
        ...prev,
        routine: {
          ...currentRoutine,
          [weekdayKey]: { ...dayData, exercises: updatedExercises },
        },
      };
    });
    showToast('Exercise removed', 'info');
  }, [showToast]);

  const reorderExercisesInRoutine = useCallback((weekdayKey, startIndex, endIndex) => {
    setData(prev => {
      const currentRoutine = prev.routine || {};
      const dayData = currentRoutine[weekdayKey] || { exercises: [] };
      const list = [...(dayData.exercises || [])];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      return {
        ...prev,
        routine: {
          ...currentRoutine,
          [weekdayKey]: { ...dayData, exercises: list },
        },
      };
    });
  }, []);

  // LOG WORKOUT WITH PROGRESSION TRACKING
  const addWorkout = useCallback((dayNum, workout) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot log workouts on future dates.', 'warning');
      return;
    }

    const dateStr = getDateForDay(dayNum);
    const newWorkout = {
      id: `w-${Date.now()}`,
      name: workout.name || 'Strength Training',
      category: workout.category || 'Chest',
      duration: Number(workout.duration) || 45,
      exercises: workout.exercises || [],
      notes: workout.notes || '',
      date: dateStr,
    };

    const historyEntry = {
      id: `wh-${Date.now()}`,
      date: dateStr,
      dayNum,
      workoutFocus: newWorkout.name,
      exercises: newWorkout.exercises,
    };

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const updatedDay = { ...day, workouts: [newWorkout, ...(day.workouts || [])] };
      const isRest = prev.routine?.[getDayOfWeekKey(dateStr)]?.isRestDay;
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: 50,
        action: `Workout: ${newWorkout.name}`,
      };

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
        workoutHistory: [historyEntry, ...(prev.workoutHistory || [])],
        stats: {
          ...prev.stats,
          totalWorkouts: (prev.stats?.totalWorkouts || 0) + 1,
          totalXp: (prev.stats?.totalXp || 0) + 50,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast('Workout recorded (+50 XP)', 'success');
  }, [isFutureDay, showToast]);

  // COURSE & TOPIC MANAGEMENT & PROGRESSION
  const addCourse = useCallback((courseData) => {
    const newCourse = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: courseData.name || 'New Course',
      code: courseData.code || '',
      semester: courseData.semester || 'Semester 1',
      priority: courseData.priority || 'High',
      examDate: courseData.examDate || '',
      units: courseData.units || [
        { id: `u-1-${Date.now()}`, title: 'Unit 1: Fundamentals', topics: [] },
      ],
    };
    setData(prev => ({
      ...prev,
      courses: [...(prev.courses || []), newCourse],
    }));
    showToast(`Course "${newCourse.name}" created`, 'success');
    return newCourse.id;
  }, [showToast]);

  const editCourse = useCallback((courseId, updates) => {
    setData(prev => ({
      ...prev,
      courses: (prev.courses || []).map(c => c.id === courseId ? { ...c, ...updates } : c),
    }));
    showToast('Course updated', 'success');
  }, [showToast]);

  const deleteCourse = useCallback((courseId) => {
    setData(prev => ({
      ...prev,
      courses: (prev.courses || []).filter(c => c.id !== courseId),
    }));
    showToast('Course removed', 'info');
  }, [showToast]);

  const addUnitToCourse = useCallback((courseId, unitTitle) => {
    const newUnit = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: unitTitle || 'New Unit',
      topics: [],
    };
    setData(prev => ({
      ...prev,
      courses: (prev.courses || []).map(c => {
        if (c.id === courseId) {
          return { ...c, units: [...(c.units || []), newUnit] };
        }
        return c;
      }),
    }));
    showToast('Unit added', 'success');
  }, [showToast]);

  const addTopicToUnit = useCallback((courseId, unitId, topicData) => {
    const newTopic = {
      id: `top-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: topicData.name || 'Topic',
      subtopic: topicData.subtopic || '',
      difficulty: topicData.difficulty || 'Medium',
      status: 'not_started', // 'not_started' | 'in_progress' | 'completed'
      notes: topicData.notes || '',
      completedDate: null,
    };
    setData(prev => ({
      ...prev,
      courses: (prev.courses || []).map(c => {
        if (c.id === courseId) {
          const updatedUnits = (c.units || []).map(u => {
            if (u.id === unitId) {
              return { ...u, topics: [...(u.topics || []), newTopic] };
            }
            return u;
          });
          return { ...c, units: updatedUnits };
        }
        return c;
      }),
    }));
    showToast(`Topic "${newTopic.name}" added`, 'success');
  }, [showToast]);

  const updateTopicStatus = useCallback((courseId, unitId, topicId, status, dayNum = activeDayNumber) => {
    const dateStr = getDateForDay(dayNum);
    setData(prev => {
      let completedTopicObj = null;
      let courseObj = null;

      const updatedCourses = (prev.courses || []).map(c => {
        if (c.id === courseId) {
          courseObj = c;
          const updatedUnits = (c.units || []).map(u => {
            if (u.id === unitId || !unitId) {
              const updatedTopics = (u.topics || []).map(t => {
                if (t.id === topicId) {
                  const updated = {
                    ...t,
                    status,
                    completedDate: status === 'completed' ? dateStr : null,
                  };
                  if (status === 'completed') completedTopicObj = updated;
                  return updated;
                }
                return t;
              });
              return { ...u, topics: updatedTopics };
            }
            return u;
          });
          return { ...c, units: updatedUnits };
        }
        return c;
      });

      // If marked completed, generate Spaced Repetition Revisions (1, 3, 7, 14 days)!
      let nextRevisions = prev.revisions || [];
      if (status === 'completed' && completedTopicObj && courseObj) {
        const newRevs = createRevisionSchedule(
          completedTopicObj.id,
          completedTopicObj.name,
          courseObj.id,
          courseObj.name,
          dateStr
        );
        nextRevisions = [...nextRevisions, ...newRevs];
      }

      const xpAmount = status === 'completed' ? 25 : 0;
      const historyItem = status === 'completed' ? {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: 25,
        action: `Topic Completed: ${completedTopicObj?.name || 'Topic'}`,
      } : null;

      return {
        ...prev,
        courses: updatedCourses,
        revisions: nextRevisions,
        stats: {
          ...prev.stats,
          totalXp: (prev.stats?.totalXp || 0) + xpAmount,
        },
        xpHistory: historyItem ? [historyItem, ...(prev.xpHistory || []).slice(0, 49)] : prev.xpHistory,
      };
    });

    if (status === 'completed') {
      showToast('Topic Completed! Revisions scheduled for 1, 3, 7, 14 days (+25 XP)', 'success');
    } else {
      showToast(`Topic marked as ${status.replace('_', ' ')}`, 'info');
    }
  }, [activeDayNumber, showToast]);

  const deleteTopicFromUnit = useCallback((courseId, unitId, topicId) => {
    setData(prev => ({
      ...prev,
      courses: (prev.courses || []).map(c => {
        if (c.id === courseId) {
          const updatedUnits = (c.units || []).map(u => {
            if (u.id === unitId) {
              return { ...u, topics: (u.topics || []).filter(t => t.id !== topicId) };
            }
            return u;
          });
          return { ...c, units: updatedUnits };
        }
        return c;
      }),
    }));
    showToast('Topic deleted', 'info');
  }, [showToast]);

  // REVISION COMPLETION
  const completeRevision = useCallback((revisionId, dayNum = activeDayNumber) => {
    const dateStr = getDateForDay(dayNum);
    setData(prev => {
      let revObj = null;
      const updatedRevs = (prev.revisions || []).map(r => {
        if (r.id === revisionId) {
          revObj = r;
          return { ...r, completed: true, completedDate: dateStr };
        }
        return r;
      });

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: 20,
        action: `Revision Completed: ${revObj?.topicName || 'Topic'} (${revObj?.intervalDays || 1}d review)`,
      };

      return {
        ...prev,
        revisions: updatedRevs,
        stats: {
          ...prev.stats,
          totalXp: (prev.stats?.totalXp || 0) + 20,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast('Revision session completed! (+20 XP)', 'success');
  }, [activeDayNumber, showToast]);

  // PROGRAMMING LANGUAGES & CODING SCHEDULE
  const updateCodingLanguages = useCallback((languages) => {
    setData(prev => ({
      ...prev,
      codingConfig: {
        ...(prev.codingConfig || {}),
        languages,
      },
    }));
    showToast('Coding languages updated', 'success');
  }, [showToast]);

  const updateCodingSchedule = useCallback((weekdayKey, lang) => {
    setData(prev => ({
      ...prev,
      codingConfig: {
        ...(prev.codingConfig || {}),
        schedule: {
          ...(prev.codingConfig?.schedule || {}),
          [weekdayKey]: lang,
        },
      },
    }));
    showToast(`${weekdayKey.charAt(0).toUpperCase() + weekdayKey.slice(1)} coding set to ${lang || 'None'}`, 'success');
  }, [showToast]);

  // LOG STUDY
  const addStudy = useCallback((dayNum, session) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot log study on future dates.', 'warning');
      return;
    }

    const durationMins = Number(session.durationMinutes) || 30;
    const hours = durationMins / 60;
    const xpVal = Math.round(hours * 30);
    const dateStr = getDateForDay(dayNum);

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const newSession = {
        id: `s-${Date.now()}`,
        subject: session.subject || 'DSA',
        topic: session.topic || '',
        durationMinutes: durationMins,
        questionsSolved: Number(session.questionsSolved) || 0,
        notes: session.notes || '',
        date: dateStr,
      };
      const updatedDay = { ...day, study: [newSession, ...(day.study || [])] };
      const isRest = prev.routine?.[getDayOfWeekKey(dateStr)]?.isRestDay;
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: Math.max(10, xpVal),
        action: `Study: ${newSession.subject}`,
      };

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
        stats: {
          ...prev.stats,
          totalStudyHours: Number(((prev.stats?.totalStudyHours || 0) + hours).toFixed(1)),
          totalXp: (prev.stats?.totalXp || 0) + Math.max(10, xpVal),
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast(`Study logged (+${Math.max(10, xpVal)} XP)`, 'success');
  }, [isFutureDay, showToast]);

  // LOG CODING
  const addCoding = useCallback((dayNum, session) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot log coding on future dates.', 'warning');
      return;
    }

    const durationMins = Number(session.durationMinutes) || 45;
    const hours = durationMins / 60;
    const solved = Number(session.problemsSolved) || 1;
    const xpVal = Math.round(hours * 30) + (solved * 10);
    const dateStr = getDateForDay(dayNum);

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const newSession = {
        id: `c-${Date.now()}`,
        language: session.language || 'Java',
        topic: session.topic || '',
        durationMinutes: durationMins,
        problemsSolved: solved,
        difficulty: session.difficulty || 'Medium',
        platform: session.platform || 'LeetCode',
        notes: session.notes || '',
        date: dateStr,
      };
      const updatedDay = { ...day, coding: [newSession, ...(day.coding || [])] };
      const isRest = prev.routine?.[getDayOfWeekKey(dateStr)]?.isRestDay;
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: xpVal,
        action: `Coding: ${newSession.language} (${newSession.problemsSolved} solved)`,
      };

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
        stats: {
          ...prev.stats,
          totalCodingHours: Number(((prev.stats?.totalCodingHours || 0) + hours).toFixed(1)),
          totalProblemsSolved: (prev.stats?.totalProblemsSolved || 0) + solved,
          totalXp: (prev.stats?.totalXp || 0) + xpVal,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast(`Coding logged (+${xpVal} XP)`, 'success');
  }, [isFutureDay, showToast]);

  // LOG SLEEP
  const logSleep = useCallback((dayNum, sleepRecord) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot log sleep for future dates.', 'warning');
      return;
    }

    const duration = Number(sleepRecord.durationHours) || 8;
    const dateStr = getDateForDay(dayNum);

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const newSleep = {
        durationHours: duration,
        bedTime: sleepRecord.bedTime || '23:00',
        wakeTime: sleepRecord.wakeTime || '07:00',
        quality: sleepRecord.quality || 'Good',
        energyLevel: sleepRecord.energyLevel || 8,
        notes: sleepRecord.notes || '',
      };
      const updatedDay = { ...day, sleep: newSleep };
      const isRest = prev.routine?.[getDayOfWeekKey(dateStr)]?.isRestDay;
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: 20,
        action: `Sleep: ${duration} hrs logged`,
      };

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
        stats: {
          ...prev.stats,
          totalXp: (prev.stats?.totalXp || 0) + 20,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast(`Sleep logged (+20 XP)`, 'success');
  }, [isFutureDay, showToast]);

  // WEIGHT LOGGING
  const addWeight = useCallback((weightVal, dateStr, note = '') => {
    const val = Number(weightVal);
    if (!val || val <= 0) return;

    setData(prev => {
      const entry = {
        id: `wt-${Date.now()}`,
        date: dateStr || getDateForDay(activeDayNumber),
        weight: val,
        note,
      };

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr || getDateForDay(activeDayNumber),
        amount: 10,
        action: `Weight logged: ${val} kg`,
      };

      return {
        ...prev,
        user: {
          ...prev.user,
          currentWeight: val,
          startingWeight: prev.user.startingWeight === null ? val : prev.user.startingWeight,
        },
        weightLog: [entry, ...(prev.weightLog || [])],
        stats: {
          ...prev.stats,
          totalXp: (prev.stats?.totalXp || 0) + 10,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast(`Weight recorded: ${val} kg (+10 XP)`, 'success');
  }, [activeDayNumber, showToast]);

  // MEAL & NUTRITION
  const addMeal = useCallback((dayNum, meal) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot log meals on future dates.', 'warning');
      return;
    }

    setData(prev => {
      const day = prev.days[dayNum] || {};
      const nutrition = day.nutrition || { calories: 0, protein: 0, water: 0, meals: [] };
      const newMeal = {
        id: `m-${Date.now()}`,
        name: meal.name,
        calories: Number(meal.calories) || 0,
        protein: Number(meal.protein) || 0,
        time: meal.time || '13:00',
        type: meal.type || 'Lunch',
      };

      return {
        ...prev,
        days: {
          ...prev.days,
          [dayNum]: {
            ...day,
            nutrition: {
              ...nutrition,
              calories: nutrition.calories + newMeal.calories,
              protein: nutrition.protein + newMeal.protein,
              meals: [newMeal, ...(nutrition.meals || [])],
            },
          },
        },
      };
    });
    showToast('Meal recorded', 'success');
  }, [isFutureDay, showToast]);

  const updateWater = useCallback((dayNum, amountLiters) => {
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const nutrition = day.nutrition || { calories: 0, protein: 0, water: 0, meals: [] };
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayNum]: {
            ...day,
            nutrition: {
              ...nutrition,
              water: Number(amountLiters),
            },
          },
        },
      };
    });
  }, []);

  // FINANCE
  const addFinance = useCallback((dayNum, tx) => {
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const entry = {
        id: `tx-${Date.now()}`,
        type: tx.type || 'expense', // 'income' | 'expense' | 'saving'
        amount: Number(tx.amount) || 0,
        category: tx.category || 'General',
        notes: tx.notes || '',
        date: getDateForDay(dayNum),
      };

      const savingDelta = entry.type === 'saving' ? entry.amount : 0;

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: { ...day, finance: [entry, ...(day.finance || [])] } },
        stats: {
          ...prev.stats,
          moneySaved: (prev.stats?.moneySaved || 0) + savingDelta,
        },
      };
    });
    showToast('Transaction logged', 'success');
  }, [showToast]);

  // LOG JOURNAL
  const saveJournal = useCallback((dayNum, journalData) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot journal for future dates.', 'warning');
      return;
    }

    const dateStr = getDateForDay(dayNum);
    setData(prev => {
      const day = prev.days[dayNum] || {};
      const updatedDay = { ...day, journal: { ...journalData, date: dateStr } };
      const isRest = prev.routine?.[getDayOfWeekKey(dateStr)]?.isRestDay;
      const { total } = calculateDailyScore(updatedDay, isRest);
      updatedDay.score = total;

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: 10,
        action: 'Daily Journal Entry',
      };

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
        stats: {
          ...prev.stats,
          totalXp: (prev.stats?.totalXp || 0) + 10,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast('Journal saved (+10 XP)', 'success');
  }, [isFutureDay, showToast]);

  // COMPLETE DAY BUTTON
  const completeDay = useCallback((dayNum = activeDayNumber) => {
    if (isFutureDay(dayNum)) {
      showToast('Cannot complete future days ahead of time.', 'warning');
      return;
    }

    const dateStr = getDateForDay(dayNum);
    setData(prev => {
      const day = prev.days[dayNum] || {};
      if (day.status === 'completed') {
        showToast('Day already marked completed', 'info');
        return prev;
      }

      const updatedDay = { ...day, status: 'completed' };
      const nextStreak = (prev.stats?.currentStreak || 0) + 1;
      const longest = Math.max(nextStreak, prev.stats?.longestStreak || 0);

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateStr,
        amount: 100,
        action: `Day ${dayNum} Completed`,
      };

      return {
        ...prev,
        days: { ...prev.days, [dayNum]: updatedDay },
        stats: {
          ...prev.stats,
          totalXp: (prev.stats?.totalXp || 0) + 100,
          currentStreak: nextStreak,
          longestStreak: longest,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast(`Day ${dayNum} Completed! (+100 XP)`, 'success');
  }, [activeDayNumber, isFutureDay, showToast]);

  // MORNING CHECK-IN DISMISS
  const dismissMorningCheckin = useCallback((dateStr) => {
    setData(prev => ({
      ...prev,
      morningCheckinDismissedDate: dateStr,
    }));
  }, []);

  // WEEKLY REVIEW SAVE
  const saveWeeklyReview = useCallback((weekKey, reviewData) => {
    setData(prev => {
      const reviews = prev.weeklyReviews || {};
      const newReviews = {
        ...reviews,
        [weekKey]: {
          ...reviewData,
          completedAt: new Date().toISOString(),
        },
      };

      const historyItem = {
        id: `xp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: getDateForDay(activeDayNumber),
        amount: 50,
        action: `Weekly Review Completed (${weekKey})`,
      };

      return {
        ...prev,
        weeklyReviews: newReviews,
        stats: {
          ...prev.stats,
          totalXp: (prev.stats?.totalXp || 0) + 50,
        },
        xpHistory: [historyItem, ...(prev.xpHistory || []).slice(0, 49)],
      };
    });
    showToast('Weekly Review saved! (+50 XP)', 'success');
  }, [activeDayNumber, showToast]);

  // NOTIFICATION CONTROLS
  const updateNotificationSettings = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      notificationSettings: {
        ...(prev.notificationSettings || {}),
        ...updates,
      },
    }));
    showToast('Notification settings updated', 'success');
  }, [showToast]);

  const sendTestNotification = useCallback(() => {
    const perm = getNotificationPermissionStatus();
    if (perm !== 'granted') {
      showToast('Notification permission not granted yet. Enable reminders first.', 'warning');
      return;
    }
    const todayStr = getDateForDay(currentDayNumber);
    const weekday = getDayOfWeekKey(todayStr);
    const dayRoutine = data.routine?.[weekday] || {};
    const course = (data.courses || []).find(c => c.id === dayRoutine.courseId);
    const nextTopic = getNextIncompleteTopic(course);

    const msg = getContextualNotificationMessage('workout', {
      workoutFocus: dayRoutine.workoutFocus,
      isRestDay: dayRoutine.isRestDay,
    });
    sendContextualNotification(msg.title, { body: msg.body });
    showToast('Test notification dispatched', 'info');
  }, [currentDayNumber, data.courses, data.routine, showToast]);

  // ONBOARDING / PROFILE CREATION
  const startWinterArc = useCallback((profileData) => {
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        name: profileData.name || 'Arc Warrior',
        avatar: profileData.avatar || '',
        age: profileData.age || '',
        height: profileData.height || '',
        startingWeight: profileData.startingWeight ? Number(profileData.startingWeight) : null,
        targetWeight: profileData.targetWeight ? Number(profileData.targetWeight) : null,
        currentWeight: profileData.startingWeight ? Number(profileData.startingWeight) : null,
        goals: profileData.goals || [],
        dailyTargets: profileData.dailyTargets || prev.user.dailyTargets,
        onboardingComplete: true,
      },
      weightLog: profileData.startingWeight ? [{
        id: `wt-${Date.now()}`,
        date: '2026-10-01',
        weight: Number(profileData.startingWeight),
        note: 'Starting weight measurement',
      }] : [],
    }));
    setActiveDayNumber(currentDayNumber);
    showToast('Winter Arc Initialized. Day 1 starts today.', 'success');
  }, [currentDayNumber, showToast]);

  // UPDATE PROFILE / SETTINGS
  const updateUserProfile = useCallback((profileUpdates) => {
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...(profileUpdates.user || profileUpdates),
      },
      settings: {
        ...prev.settings,
        ...(profileUpdates.settings || {}),
      },
    }));
    showToast('Profile updated', 'success');
  }, [showToast]);

  const updateSettings = useCallback((settingsUpdates) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settingsUpdates,
      },
    }));
    showToast('Settings updated', 'success');
  }, [showToast]);

  const updatePreferences = useCallback((prefUpdates) => {
    setData(prev => ({
      ...prev,
      preferences: {
        ...(prev.preferences || {}),
        ...prefUpdates,
      },
    }));
    showToast('Preferences updated', 'success');
  }, [showToast]);

  // RESET CHALLENGE
  const resetWinterArc = useCallback(() => {
    const fresh = createEmptyWinterArcState();
    setData(fresh);
    setActiveDayNumber(1);
    showToast('Winter Arc has been completely reset.', 'info');
  }, [showToast]);

  // EXPORT / IMPORT
  const exportData = useCallback(() => {
    exportDataAsJSON(data);
    showToast('Data exported as JSON', 'success');
  }, [data, showToast]);

  const importData = useCallback((importedJson) => {
    try {
      if (!importedJson || !importedJson.days) throw new Error('Invalid format');
      setData(importedJson);
      showToast('Winter Arc backup restored', 'success');
    } catch (e) {
      showToast('Failed to import file: Invalid Winter Arc data', 'danger');
    }
  }, [showToast]);

  const openQuickAdd = useCallback((tab = 'task') => {
    setQuickAddTab(tab);
    setQuickAddOpen(true);
  }, []);

  const currentDayData = data.days?.[activeDayNumber] || {};
  const isRest = data.routine?.[getDayOfWeekKey(currentDayData.date)]?.isRestDay;
  const currentDayScoreObj = calculateDailyScore(currentDayData, isRest);
  const levelInfo = calculateLevel(data.stats?.totalXp || 0);

  // Dynamic Streak Calculation from real stored data
  const realStreak = useMemo(() => {
    let streak = 0;
    for (let i = currentDayNumber - 1; i >= 1; i--) {
      const d = data.days?.[i];
      if (d && d.status === 'completed') {
        streak++;
      } else {
        break;
      }
    }
    if (data.days?.[currentDayNumber]?.status === 'completed') {
      streak++;
    }
    return streak;
  }, [data.days, currentDayNumber]);

  return (
    <AppContext.Provider
      value={{
        data,
        currentDayNumber,
        activeDayNumber,
        setActiveDayNumber,
        currentDayData,
        currentDayScoreObj,
        levelInfo,
        realStreak,
        toasts,
        isFutureDay,
        showToast,
        awardXp,
        // Tasks & Automation
        toggleTask,
        skipTask,
        rescheduleTask,
        editTask,
        deleteTask,
        addTask,
        syncAutomatedDayPlan,
        // Habits
        addHabit,
        toggleHabit,
        deleteHabit,
        // Routine & Workouts
        updateDayRoutine,
        updateWeeklyRoutine,
        addExerciseToRoutine,
        editExerciseInRoutine,
        deleteExerciseFromRoutine,
        reorderExercisesInRoutine,
        addWorkout,
        // Courses, Topics & Revisions
        addCourse,
        editCourse,
        deleteCourse,
        addUnitToCourse,
        addTopicToUnit,
        updateTopicStatus,
        deleteTopicFromUnit,
        completeRevision,
        // Coding
        updateCodingLanguages,
        updateCodingSchedule,
        addCoding,
        // Study, Sleep, Weight, Nutrition, Finance, Journal
        addStudy,
        logSleep,
        addWeight,
        addMeal,
        updateWater,
        addFinance,
        saveJournal,
        completeDay,
        // Morning Check-In & Weekly Review
        dismissMorningCheckin,
        saveWeeklyReview,
        // Notifications & Preferences
        updateNotificationSettings,
        sendTestNotification,
        updatePreferences,
        // Profile & Challenge Actions
        startWinterArc,
        updateUserProfile,
        updateSettings,
        resetWinterArc,
        exportData,
        importData,
        // Quick add
        quickAddOpen,
        setQuickAddOpen,
        quickAddTab,
        openQuickAdd,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
