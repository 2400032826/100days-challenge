// Winter Arc Clean Engine
// START DATE: October 1, 2026 (Day 1)
// END DATE: January 8, 2027 (Day 100)

export const STORAGE_KEY = 'winter_arc_prod_v2';
export const START_DATE_STR = '2026-10-01';
export const END_DATE_STR = '2027-01-08';

export const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const ORDERED_WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const WEEKDAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// Calculate the current Day (1 to 100) dynamically from actual date
export function calculateCurrentDayNumber() {
  const start = new Date(2026, 9, 1); // Month is 0-indexed: 9 = October
  const now = new Date();
  const startUtc = Date.UTC(2026, 9, 1);
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((nowUtc - startUtc) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 1; // Before start date => Day 1
  if (diffDays >= 100) return 100; // Past 100 days
  return diffDays + 1; // e.g. Oct 1 -> Day 1, Oct 2 -> Day 2
}

// Generate the 100-day date string for Day N
export function getDateForDay(dayNumber) {
  const start = new Date(2026, 9, 1);
  start.setDate(start.getDate() + (dayNumber - 1));
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function getDayOfWeekKey(dateStr) {
  if (!dateStr) return 'thursday';
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  const dayIdx = dateObj.getDay();
  return WEEKDAY_KEYS[dayIdx];
}

export function getDayOfWeekName(dateStr) {
  const key = getDayOfWeekKey(dateStr);
  return WEEKDAY_LABELS[key] || 'Thursday';
}

export const INITIAL_ACHIEVEMENTS = [
  { id: 'first_habit', title: 'First Habit', desc: 'Complete your first habit check', icon: 'CheckSquare', unlocked: false, unlockedAt: null },
  { id: 'first_workout', title: 'First Workout', desc: 'Log your first physical training session', icon: 'Dumbbell', unlocked: false, unlockedAt: null },
  { id: 'first_study', title: 'First Study Session', desc: 'Clock your first deep study block', icon: 'BookOpen', unlocked: false, unlockedAt: null },
  { id: 'first_code', title: 'First Problem Solved', desc: 'Log and solve your first coding problem', icon: 'Code', unlocked: false, unlockedAt: null },
  { id: 'first_journal', title: 'First Journal Entry', desc: 'Record your first daily reflection and win', icon: 'PenLine', unlocked: false, unlockedAt: null },
  { id: 'streak_7', title: '7-Day Streak', desc: 'Build 7 consecutive days of discipline', icon: 'Flame', unlocked: false, unlockedAt: null },
  { id: 'streak_14', title: '14-Day Streak', desc: 'Fortnight of relentless execution', icon: 'Shield', unlocked: false, unlockedAt: null },
  { id: 'streak_30', title: '30-Day Streak', desc: 'One full month without breaking the chain', icon: 'Award', unlocked: false, unlockedAt: null },
  { id: 'streak_50', title: '50-Day Streak', desc: 'Halfway through the 100-day storm', icon: 'Compass', unlocked: false, unlockedAt: null },
  { id: 'streak_75', title: '75-Day Streak', desc: 'Unshakable transformation standard', icon: 'Sparkles', unlocked: false, unlockedAt: null },
  { id: 'workouts_10', title: '10 Workouts Logged', desc: 'Complete 10 training sessions', icon: 'Dumbbell', unlocked: false, unlockedAt: null },
  { id: 'study_50', title: '50 Study Hours', desc: 'Clock 50 hours of deep learning', icon: 'BookOpen', unlocked: false, unlockedAt: null },
  { id: 'coding_50', title: '50 Coding Hours', desc: 'Clock 50 hours of software practice', icon: 'Code', unlocked: false, unlockedAt: null },
  { id: 'streak_100', title: '100-Day Survivor', desc: 'Complete the full Winter Arc challenge', icon: 'Trophy', unlocked: false, unlockedAt: null },
];

export const LEVEL_TIERS = [
  { level: 1, title: 'Starting Point', minXp: 0, maxXp: 499 },
  { level: 2, title: 'Spark', minXp: 500, maxXp: 999 },
  { level: 3, title: 'Ignition', minXp: 1000, maxXp: 1499 },
  { level: 4, title: 'Gaining Ground', minXp: 1500, maxXp: 1999 },
  { level: 5, title: 'Building Momentum', minXp: 2000, maxXp: 2599 },
  { level: 10, title: 'Consistent', minXp: 4500, maxXp: 5499 },
  { level: 20, title: 'Disciplined', minXp: 9000, maxXp: 11999 },
  { level: 30, title: 'Unstoppable', minXp: 15000, maxXp: 999999 },
];

export function calculateLevel(xp = 0) {
  let matched = LEVEL_TIERS[0];
  for (const tier of LEVEL_TIERS) {
    if (xp >= tier.minXp) {
      matched = tier;
    } else {
      break;
    }
  }
  const nextTier = LEVEL_TIERS.find(t => t.minXp > matched.minXp) || { minXp: matched.minXp + 500 };
  const xpInLevel = xp - matched.minXp;
  const xpNeeded = nextTier.minXp - matched.minXp;
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return {
    level: matched.level,
    title: matched.title,
    currentXp: xp,
    nextLevelXp: nextTier.minXp,
    xpToNext: Math.max(0, nextTier.minXp - xp),
    progressPercent: isNaN(progressPercent) ? 0 : progressPercent,
  };
}

// Clean Empty Routine Creator (Zero dummy data, user configures each day)
export function createEmptyRoutine() {
  const routine = {};
  for (const day of ORDERED_WEEKDAYS) {
    routine[day] = {
      workoutFocus: '', // e.g. "Chest + Triceps" or empty
      exercises: [], // [{ id, name, sets: 3, reps: 10, weight: 0, restTime: 60 }]
      courseId: '', // user's course ID
      codingLang: '', // e.g. "Java"
      other: '', // e.g. "Reading" or "Project"
      isRestDay: false, // if true => Recovery Day
    };
  }
  return routine;
}

// Find the NEXT incomplete topic in a course
export function getNextIncompleteTopic(course) {
  if (!course || !course.units || !Array.isArray(course.units)) return null;
  for (const unit of course.units) {
    if (!unit.topics || !Array.isArray(unit.topics)) continue;
    for (const topic of unit.topics) {
      if (topic.status !== 'completed') {
        return {
          ...topic,
          unitTitle: unit.title || 'Unit',
          courseName: course.name,
          courseCode: course.code,
        };
      }
    }
  }
  return null;
}

// Create Spaced Repetition Revision Schedule (1 day, 3 days, 7 days, 14 days)
export function createRevisionSchedule(topicId, topicName, courseId, courseName, completedDateStr) {
  const intervals = [1, 3, 7, 14];
  const [y, m, d] = (completedDateStr || '2026-10-01').split('-');
  const baseDate = new Date(Number(y), Number(m) - 1, Number(d));

  return intervals.map(days => {
    const revDate = new Date(baseDate);
    revDate.setDate(revDate.getDate() + days);
    const ry = revDate.getFullYear();
    const rm = String(revDate.getMonth() + 1).padStart(2, '0');
    const rd = String(revDate.getDate()).padStart(2, '0');
    const dueDate = `${ry}-${rm}-${rd}`;

    return {
      id: `rev-${topicId}-${days}d-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      topicId,
      topicName,
      courseId,
      courseName,
      intervalDays: days,
      dueDate,
      completed: false,
      completedDate: null,
    };
  });
}

// Track previous workout performance (strict real history, never fabricate)
export function getLastPerformanceForExercise(workoutHistory, exerciseName) {
  if (!workoutHistory || !Array.isArray(workoutHistory) || !exerciseName) return null;
  const cleanName = exerciseName.trim().toLowerCase();
  for (let i = workoutHistory.length - 1; i >= 0; i--) {
    const sess = workoutHistory[i];
    if (!sess || !sess.exercises) continue;
    const found = sess.exercises.find(e => e.name && e.name.trim().toLowerCase() === cleanName);
    if (found && (Number(found.weight) > 0 || Number(found.reps) > 0 || Number(found.sets) > 0)) {
      return {
        date: sess.date,
        sets: Number(found.sets) || 0,
        reps: Number(found.reps) || 0,
        weight: Number(found.weight) || 0,
        restTime: Number(found.restTime) || 60,
      };
    }
  }
  return null;
}

// Build Automated Smart Day Plan based on Day of Week + Routine + Topics + Revisions
export function buildAutomatedDayPlan(dayNumber, dateStr, routine = {}, courses = [], codingConfig = {}, habits = [], revisions = []) {
  const weekdayKey = getDayOfWeekKey(dateStr);
  const dayRoutine = routine[weekdayKey] || {
    workoutFocus: '',
    exercises: [],
    courseId: '',
    codingLang: '',
    other: '',
    isRestDay: false,
  };

  const tasks = [];

  // 1. MORNING
  tasks.push({
    id: `auto-m1-${dayNumber}`,
    title: 'Wake up on time',
    time: '06:00',
    category: 'morning',
    completed: false,
    status: 'pending',
    xp: 10,
    isAutomated: true,
  });
  tasks.push({
    id: `auto-m2-${dayNumber}`,
    title: 'Hydrate 500ml water',
    time: '06:15',
    category: 'morning',
    completed: false,
    status: 'pending',
    xp: 5,
    isAutomated: true,
  });
  tasks.push({
    id: `auto-m3-${dayNumber}`,
    title: 'Morning planning & day review',
    time: '07:00',
    category: 'morning',
    completed: false,
    status: 'pending',
    xp: 10,
    isAutomated: true,
  });

  // 2. FOCUS - STUDY & CODING
  // Study Course + Topic
  if (dayRoutine.courseId) {
    const course = courses.find(c => c.id === dayRoutine.courseId);
    if (course) {
      const nextTopic = getNextIncompleteTopic(course);
      const topicLabel = nextTopic ? ` · Topic: ${nextTopic.name}` : ' · All topics completed!';
      tasks.push({
        id: `auto-study-${dayNumber}`,
        title: `Study: ${course.name}${topicLabel}`,
        time: '09:00',
        category: 'focus',
        completed: false,
        status: 'pending',
        xp: 25,
        courseId: course.id,
        topicId: nextTopic?.id || null,
        isAutomated: true,
      });
    } else {
      tasks.push({
        id: `auto-study-${dayNumber}`,
        title: 'Study session',
        time: '09:00',
        category: 'focus',
        completed: false,
        status: 'pending',
        xp: 20,
        isAutomated: true,
      });
    }
  } else {
    tasks.push({
      id: `auto-study-${dayNumber}`,
      title: 'Study session',
      time: '09:00',
      category: 'focus',
      completed: false,
      status: 'pending',
      xp: 20,
      isAutomated: true,
    });
  }

  // Due Revisions for today
  const dueRevs = (revisions || []).filter(r => r.dueDate === dateStr && !r.completed);
  dueRevs.forEach((rev, idx) => {
    tasks.push({
      id: `auto-rev-${rev.id}-${idx}`,
      title: `Revision: ${rev.topicName} (${rev.courseName} · ${rev.intervalDays}d review)`,
      time: '11:30',
      category: 'focus',
      completed: false,
      status: 'pending',
      xp: 20,
      revisionId: rev.id,
      isAutomated: true,
    });
  });

  // Coding Language from Routine or Schedule
  const codingLang = dayRoutine.codingLang || codingConfig.schedule?.[weekdayKey] || '';
  if (codingLang) {
    tasks.push({
      id: `auto-code-${dayNumber}`,
      title: `Coding: ${codingLang} session`,
      time: '14:00',
      category: 'focus',
      completed: false,
      status: 'pending',
      xp: 25,
      codingLang,
      isAutomated: true,
    });
  } else {
    tasks.push({
      id: `auto-code-${dayNumber}`,
      title: 'Coding practice',
      time: '14:00',
      category: 'focus',
      completed: false,
      status: 'pending',
      xp: 20,
      isAutomated: true,
    });
  }

  // Other focus (e.g. Reading, Project)
  if (dayRoutine.other) {
    tasks.push({
      id: `auto-other-${dayNumber}`,
      title: `${dayRoutine.other}`,
      time: '16:00',
      category: 'focus',
      completed: false,
      status: 'pending',
      xp: 15,
      isAutomated: true,
    });
  }

  // 3. HEALTH & WORKOUT
  if (dayRoutine.isRestDay) {
    tasks.push({
      id: `auto-workout-${dayNumber}`,
      title: 'Recovery Day (Mobility / Light Walk / Rest)',
      time: '17:30',
      category: 'health',
      completed: false,
      status: 'pending',
      xp: 15,
      isRestDay: true,
      isAutomated: true,
    });
  } else if (dayRoutine.workoutFocus) {
    const exCount = (dayRoutine.exercises || []).length;
    const countLabel = exCount > 0 ? ` (${exCount} exercises)` : '';
    tasks.push({
      id: `auto-workout-${dayNumber}`,
      title: `Workout: ${dayRoutine.workoutFocus}${countLabel}`,
      time: '17:30',
      category: 'health',
      completed: false,
      status: 'pending',
      xp: 30,
      workoutFocus: dayRoutine.workoutFocus,
      isAutomated: true,
    });
  } else {
    tasks.push({
      id: `auto-workout-${dayNumber}`,
      title: 'Workout session',
      time: '17:30',
      category: 'health',
      completed: false,
      status: 'pending',
      xp: 25,
      isAutomated: true,
    });
  }

  tasks.push({
    id: `auto-h2-${dayNumber}`,
    title: 'Daily steps target (10,000 steps)',
    time: '19:00',
    category: 'health',
    completed: false,
    status: 'pending',
    xp: 15,
    isAutomated: true,
  });

  tasks.push({
    id: `auto-h3-${dayNumber}`,
    title: 'Clean nutrition & protein goal',
    time: '20:00',
    category: 'health',
    completed: false,
    status: 'pending',
    xp: 15,
    isAutomated: true,
  });

  // 4. EVENING
  tasks.push({
    id: `auto-e1-${dayNumber}`,
    title: 'Daily journal reflection & win of the day',
    time: '21:30',
    category: 'evening',
    completed: false,
    status: 'pending',
    xp: 10,
    isAutomated: true,
  });
  tasks.push({
    id: `auto-e2-${dayNumber}`,
    title: 'Review today\'s execution & tomorrow prep',
    time: '22:00',
    category: 'evening',
    completed: false,
    status: 'pending',
    xp: 10,
    isAutomated: true,
  });
  tasks.push({
    id: `auto-e3-${dayNumber}`,
    title: 'Sleep preparation & wind-down',
    time: '22:30',
    category: 'evening',
    completed: false,
    status: 'pending',
    xp: 10,
    isAutomated: true,
  });

  return tasks;
}

// Calculate Daily Score only from real recorded information:
// Tasks: 30% | Fitness: 20% | Study: 20% | Coding: 15% | Sleep: 10% | Journal: 5%
export function calculateDailyScore(dayData, isRestDay = false) {
  if (!dayData) return { total: 0, breakdown: { tasks: 0, fitness: 0, study: 0, coding: 0, sleep: 0, journal: 0 } };

  // 1. Tasks (30 pts)
  const tasks = dayData.tasks || [];
  let tasksScore = 0;
  if (tasks.length > 0) {
    const completedCount = tasks.filter(t => t.completed).length;
    tasksScore = Math.round((completedCount / tasks.length) * 30);
  }

  // 2. Fitness (20 pts) - On rest day, recovery walk or rest counts as fitness!
  let fitnessScore = 0;
  if (dayData.workouts && dayData.workouts.length > 0) {
    fitnessScore = 20;
  } else if (isRestDay) {
    // Rest day: if rest task is checked or user marked rest
    const restTask = tasks.find(t => t.isRestDay && t.completed);
    if (restTask || dayData.restDayCompleted) fitnessScore = 20;
  }

  // 3. Study (20 pts)
  let studyScore = 0;
  if (dayData.study && dayData.study.length > 0) {
    const mins = dayData.study.reduce((a, s) => a + (Number(s.durationMinutes) || 0), 0);
    studyScore = Math.min(20, Math.round((mins / 60) * 20));
  }

  // 4. Coding (15 pts)
  let codingScore = 0;
  if (dayData.coding && dayData.coding.length > 0) {
    const mins = dayData.coding.reduce((a, c) => a + (Number(c.durationMinutes) || 0), 0);
    codingScore = Math.min(15, Math.round((mins / 60) * 15));
  }

  // 5. Sleep (10 pts)
  let sleepScore = 0;
  if (dayData.sleep && Number(dayData.sleep.durationHours) > 0) {
    const hrs = Number(dayData.sleep.durationHours);
    sleepScore = Math.min(10, Math.round((hrs / 8) * 10));
  }

  // 6. Journal (5 pts)
  let journalScore = 0;
  if (dayData.journal && (dayData.journal.win || dayData.journal.gratitude || dayData.journal.wrong)) {
    journalScore = 5;
  }

  const total = Math.min(100, tasksScore + fitnessScore + studyScore + codingScore + sleepScore + journalScore);

  return {
    total,
    breakdown: {
      tasks: tasksScore,
      fitness: fitnessScore,
      study: studyScore,
      coding: codingScore,
      sleep: sleepScore,
      journal: journalScore,
    },
  };
}

// Create Fresh State - ZERO DUMMY DATA
export function createEmptyWinterArcState() {
  const currentDay = calculateCurrentDayNumber();
  const emptyRoutine = createEmptyRoutine();

  const days = {};
  for (let i = 1; i <= 100; i++) {
    const dateStr = getDateForDay(i);
    let status = 'future';
    if (i === currentDay) status = 'current';
    else if (i < currentDay) status = 'missed';

    days[i] = {
      dayNumber: i,
      date: dateStr,
      status: status,
      score: 0,
      habitsCompleted: [],
      tasks: buildAutomatedDayPlan(i, dateStr, emptyRoutine, [], {}, [], []),
      workouts: [],
      study: [],
      coding: [],
      sleep: null,
      nutrition: {
        calories: 0,
        protein: 0,
        water: 0,
        meals: [],
      },
      finance: [],
      journal: null,
      weight: null,
      restDayCompleted: false,
    };
  }

  return {
    user: {
      name: '',
      avatar: '',
      age: '',
      height: '',
      startingWeight: null, // "Not recorded" until user logs
      targetWeight: null,
      currentWeight: null,
      startDate: START_DATE_STR,
      endDate: END_DATE_STR,
      goals: [],
      dailyTargets: {
        workoutMinutes: 45,
        studyHours: 2,
        codingHours: 2,
        sleepHours: 8,
        waterLiters: 3.0,
        steps: 10000,
        readingMinutes: 30,
      },
      onboardingComplete: false,
    },
    routine: emptyRoutine, // Configurable weekly routine for Monday - Sunday
    courses: [], // Configurable user courses with units & topics
    codingConfig: {
      languages: [], // Java, Python, SQL, C++, etc.
      schedule: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: '',
      },
    },
    revisions: [], // Spaced repetition schedule (1, 3, 7, 14 days)
    workoutHistory: [], // Log of past workouts for previous performance comparison
    habits: [], // Starts empty! User adds their own habits
    days: days,
    xpHistory: [], // Real log of every XP earned
    stats: {
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0,
      totalStudyHours: 0,
      totalCodingHours: 0,
      totalProblemsSolved: 0,
      moneySaved: 0,
    },
    weightLog: [], // Starts empty: [{ date, weight, note }]
    achievements: INITIAL_ACHIEVEMENTS,
    notificationSettings: {
      enabled: false, // Default OFF
      permissionStatus: 'default',
      times: {
        workout: '17:00',
        study: '09:00',
        coding: '14:00',
        habits: '12:00',
        journal: '21:30',
        sleep: '22:30',
        weekly: '10:00',
      },
      reminders: {
        workout: false,
        study: false,
        coding: false,
        habits: false,
        journal: false,
        sleep: false,
        weekly: false,
      },
      lastSentLog: {},
    },
    preferences: {
      workoutDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      workoutTime: '17:30',
      studyDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      studyTime: '09:00',
      codingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      codingTime: '14:00',
    },
    morningCheckinDismissedDate: null,
    weeklyReviews: {}, // { 'week-1': { whatWentWell: '', whatShouldImprove: '', nextFocus: '', completedAt: '' } }
  };
}

// Storage helpers with safe migration & zero fake data
export function loadWinterArcData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = createEmptyWinterArcState();
      saveWinterArcData(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.user || !parsed.days) {
      const fresh = createEmptyWinterArcState();
      saveWinterArcData(fresh);
      return fresh;
    }

    // Ensure all new schema properties exist cleanly without overriding user records
    const emptyFresh = createEmptyWinterArcState();
    const migrated = {
      ...emptyFresh,
      ...parsed,
      user: { ...emptyFresh.user, ...(parsed.user || {}) },
      routine: { ...emptyFresh.routine, ...(parsed.routine || {}) },
      courses: Array.isArray(parsed.courses) ? parsed.courses : [],
      codingConfig: { ...emptyFresh.codingConfig, ...(parsed.codingConfig || {}) },
      revisions: Array.isArray(parsed.revisions) ? parsed.revisions : [],
      workoutHistory: Array.isArray(parsed.workoutHistory) ? parsed.workoutHistory : [],
      notificationSettings: { ...emptyFresh.notificationSettings, ...(parsed.notificationSettings || {}) },
      preferences: { ...emptyFresh.preferences, ...(parsed.preferences || {}) },
      weeklyReviews: parsed.weeklyReviews || {},
    };

    return migrated;
  } catch (err) {
    console.error('Failed to load Winter Arc data:', err);
    return createEmptyWinterArcState();
  }
}

export function saveWinterArcData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save Winter Arc data:', err);
  }
}

export function exportDataAsJSON(data) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `winter-arc-${START_DATE_STR}-backup.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
