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

// Calculate current Day (1 to 100) dynamically from actual date
export function calculateCurrentDayNumber() {
  const start = new Date(2026, 9, 1); // Month 9 = October
  const now = new Date();
  const startUtc = Date.UTC(2026, 9, 1);
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((nowUtc - startUtc) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 1; // Before start date => Day 1
  if (diffDays >= 100) return 100; // Past 100 days
  return diffDays + 1; // Oct 1 -> Day 1, Oct 2 -> Day 2
}

// Generate date string for Day N
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

// Simple Setup Defaults
export const DEFAULT_ROUTINE_CONFIG = {
  // Daily routine times
  wakeUpTime: '06:30',
  breakfastTime: '08:00',
  lunchTime: '13:00',
  dinnerTime: '20:00',
  sleepTime: '22:30',

  // Health
  waterGoalLiters: 3.0,
  waterReminderIntervalHours: 2,
  waterRemindersEnabled: false,
  workoutEnabled: true,
  workoutTime: '17:30',
  stepsGoal: 10000,
  activityEnabled: true,
  activityTime: '19:00',

  // Study
  studyEnabled: true,
  studyTime: '09:00',
  courseName: 'DBMS',
  courseCode: '24CSXXXX',
  currentTopic: 'Normalization',

  // Coding
  codingEnabled: true,
  codingTime: '14:30',
  codingLanguage: 'Java',
  codingDurationMins: 60,

  // Other
  journalEnabled: true,
  journalTime: '21:30',
  meditationEnabled: false,
  meditationTime: '07:00',

  // Active days
  workoutDays: ['monday', 'wednesday', 'friday'],
  studyDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  codingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
};

// Clean Empty Routine Creator
export function createEmptyRoutine() {
  const routine = {};
  for (const day of ORDERED_WEEKDAYS) {
    routine[day] = {
      workoutFocus: day === 'monday' ? 'Chest + Triceps' : day === 'wednesday' ? 'Legs + Core' : day === 'friday' ? 'Back + Biceps' : '',
      exercises: [],
      courseId: '',
      codingLang: 'Java',
      other: '',
      isRestDay: day === 'sunday' || day === 'tuesday' || day === 'thursday' || day === 'saturday',
    };
  }
  return routine;
}

// Find NEXT incomplete topic in a course
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

// Spaced Repetition Revision Schedule (1 day, 3 days, 7 days, 14 days)
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

// Track previous workout performance (strict real history)
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

// Build Automated Smart Day Plan: Clean Chronological Timeline
// 🌅 Wake Up -> 💧 Water -> 🍳 Breakfast -> 📚 Study -> 💻 Coding -> 🏋️ Workout -> 🍛 Lunch -> 🚶 Activity -> 🍽️ Dinner -> 📝 Journal -> 😴 Sleep
export function buildAutomatedDayPlan(dayNumber, dateStr, routineConfig = DEFAULT_ROUTINE_CONFIG, routine = {}, courses = [], codingConfig = {}, habits = [], revisions = [], existingDayData = null) {
  const cfg = { ...DEFAULT_ROUTINE_CONFIG, ...(routineConfig || {}) };
  const weekdayKey = getDayOfWeekKey(dateStr);
  const dayRoutine = routine[weekdayKey] || {};
  const isRest = dayRoutine.isRestDay || !cfg.workoutDays?.includes(weekdayKey);

  const tasks = [];

  // 1. 🌅 Wake Up
  tasks.push({
    id: `auto-wake-${dayNumber}`,
    title: 'Wake Up on Time',
    time: cfg.wakeUpTime || '06:30',
    icon: '🌅',
    category: 'morning',
    completed: false,
    status: 'pending',
    type: 'routine',
  });

  // 2. 💧 Water (Morning Hydration)
  tasks.push({
    id: `auto-water-morning-${dayNumber}`,
    title: 'Hydrate 500ml Water',
    time: '07:00',
    icon: '💧',
    category: 'morning',
    completed: false,
    status: 'pending',
    type: 'water',
  });

  // 3. 🍳 Breakfast
  const bfastDesc = existingDayData?.meals?.breakfast?.description;
  tasks.push({
    id: `auto-breakfast-${dayNumber}`,
    title: bfastDesc ? `Breakfast: ${bfastDesc}` : 'Breakfast (Tap to add meal)',
    time: cfg.breakfastTime || '08:00',
    icon: '🍳',
    category: 'morning',
    completed: existingDayData?.meals?.breakfast?.completed || false,
    status: existingDayData?.meals?.breakfast?.completed ? 'completed' : 'pending',
    type: 'meal',
    mealType: 'breakfast',
  });

  // 4. 📚 Study (only if study enabled & today is active study day)
  if (cfg.studyEnabled !== false && (cfg.studyDays || []).includes(weekdayKey)) {
    const course = courses.find(c => c.id === dayRoutine.courseId) || courses[0];
    const nextTopic = course ? getNextIncompleteTopic(course) : null;
    const cName = course?.name || cfg.courseName || 'Deep Study';
    const tName = nextTopic?.name || cfg.currentTopic || 'Session';

    tasks.push({
      id: `auto-study-${dayNumber}`,
      title: `Study: ${cName} — ${tName}`,
      time: cfg.studyTime || '09:00',
      icon: '📚',
      category: 'focus',
      completed: false,
      status: 'pending',
      type: 'study',
      courseId: course?.id || null,
      topicId: nextTopic?.id || null,
    });
  }

  // 4b. Due Spaced Revisions for today
  const dueRevs = (revisions || []).filter(r => r.dueDate === dateStr && !r.completed);
  dueRevs.forEach((rev, idx) => {
    tasks.push({
      id: `auto-rev-${rev.id}-${idx}`,
      title: `Revision: ${rev.topicName} (${rev.courseName} · ${rev.intervalDays}d review)`,
      time: '11:30',
      icon: '🔄',
      category: 'focus',
      completed: false,
      status: 'pending',
      type: 'revision',
      revisionId: rev.id,
    });
  });

  // 5. 💻 Coding (only if coding enabled & today is active coding day)
  if (cfg.codingEnabled !== false && (cfg.codingDays || []).includes(weekdayKey)) {
    const lang = dayRoutine.codingLang || cfg.codingLanguage || 'Java';
    tasks.push({
      id: `auto-code-${dayNumber}`,
      title: `Coding: ${lang} Practice (${cfg.codingDurationMins || 60}m)`,
      time: cfg.codingTime || '14:30',
      icon: '💻',
      category: 'focus',
      completed: false,
      status: 'pending',
      type: 'coding',
    });
  }

  // 6. 🏋️ Workout (only if workout enabled)
  if (cfg.workoutEnabled !== false) {
    if (isRest) {
      tasks.push({
        id: `auto-workout-${dayNumber}`,
        title: 'Recovery / Rest Day (Light Walk & Rest)',
        time: cfg.workoutTime || '17:30',
        icon: '🛌',
        category: 'health',
        completed: false,
        status: 'pending',
        type: 'workout',
        isRestDay: true,
      });
    } else {
      const splitName = dayRoutine.workoutFocus || 'Strength Training';
      tasks.push({
        id: `auto-workout-${dayNumber}`,
        title: `Workout: ${splitName}`,
        time: cfg.workoutTime || '17:30',
        icon: '🏋️',
        category: 'health',
        completed: false,
        status: 'pending',
        type: 'workout',
        workoutFocus: splitName,
      });
    }
  }

  // 7. 🍛 Lunch
  const lunchDesc = existingDayData?.meals?.lunch?.description;
  tasks.push({
    id: `auto-lunch-${dayNumber}`,
    title: lunchDesc ? `Lunch: ${lunchDesc}` : 'Lunch (Tap to add meal)',
    time: cfg.lunchTime || '13:00',
    icon: '🍛',
    category: 'health',
    completed: existingDayData?.meals?.lunch?.completed || false,
    status: existingDayData?.meals?.lunch?.completed ? 'completed' : 'pending',
    type: 'meal',
    mealType: 'lunch',
  });

  // 8. 🚶 Activity / Steps (only if activity enabled)
  if (cfg.activityEnabled !== false) {
    tasks.push({
      id: `auto-activity-${dayNumber}`,
      title: `Daily Activity Goal (${(cfg.stepsGoal || 10000).toLocaleString()} steps)`,
      time: cfg.activityTime || '19:00',
      icon: '🚶',
      category: 'health',
      completed: false,
      status: 'pending',
      type: 'activity',
    });
  }

  // 9. 🍽️ Dinner
  const dinnerDesc = existingDayData?.meals?.dinner?.description;
  tasks.push({
    id: `auto-dinner-${dayNumber}`,
    title: dinnerDesc ? `Dinner: ${dinnerDesc}` : 'Dinner (Tap to add meal)',
    time: cfg.dinnerTime || '20:00',
    icon: '🍽️',
    category: 'evening',
    completed: existingDayData?.meals?.dinner?.completed || false,
    status: existingDayData?.meals?.dinner?.completed ? 'completed' : 'pending',
    type: 'meal',
    mealType: 'dinner',
  });

  // 10. 📝 Journal (only if journal enabled)
  if (cfg.journalEnabled !== false) {
    tasks.push({
      id: `auto-journal-${dayNumber}`,
      title: 'Daily Journal Reflection & Win',
      time: cfg.journalTime || '21:30',
      icon: '📝',
      category: 'evening',
      completed: false,
      status: 'pending',
      type: 'journal',
    });
  }

  // 11. 😴 Sleep
  tasks.push({
    id: `auto-sleep-${dayNumber}`,
    title: 'Sleep Wind-Down & 8h Rest',
    time: cfg.sleepTime || '22:30',
    icon: '😴',
    category: 'evening',
    completed: false,
    status: 'pending',
    type: 'sleep',
  });

  // Sort chronologically by time
  tasks.sort((a, b) => (a.time || '12:00').localeCompare(b.time || '12:00'));

  return tasks;
}

// Calculate Daily Score: Simple & pure from actual completed tasks
// Example: 5 tasks planned, 3 completed = 60%. If 0 tasks: 0%.
export function calculateDailyScore(dayData) {
  if (!dayData || !dayData.tasks || !Array.isArray(dayData.tasks) || dayData.tasks.length === 0) {
    return { total: 0, completedCount: 0, totalCount: 0 };
  }
  const completedCount = dayData.tasks.filter(t => t.completed).length;
  const totalCount = dayData.tasks.length;
  const total = Math.round((completedCount / totalCount) * 100);
  return { total, completedCount, totalCount };
}

// Create Fresh State - ZERO DUMMY DATA
export function createEmptyWinterArcState() {
  const currentDay = calculateCurrentDayNumber();
  const emptyRoutine = createEmptyRoutine();
  const defaultCfg = { ...DEFAULT_ROUTINE_CONFIG };

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
      tasks: buildAutomatedDayPlan(i, dateStr, defaultCfg, emptyRoutine, [], {}, [], []),
      workouts: [],
      study: [],
      coding: [],
      sleep: null,
      meals: {
        breakfast: { time: '08:00', description: '', completed: false },
        lunch: { time: '13:00', description: '', completed: false },
        dinner: { time: '20:00', description: '', completed: false },
        snacks: { time: '16:30', description: '', completed: false },
      },
      nutrition: {
        water: 0,
        calories: 0,
        protein: 0,
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
      startingWeight: null,
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
    routineConfig: defaultCfg,
    routine: emptyRoutine,
    courses: [
      {
        id: 'c-dbms',
        name: 'DBMS',
        code: '24CSXXXX',
        semester: 'Semester 3',
        priority: 'High',
        units: [
          {
            id: 'u-1',
            title: 'Unit 1: Foundations',
            topics: [
              { id: 't-1', name: 'ER Model', status: 'not_started' },
              { id: 't-2', name: 'SQL Queries', status: 'not_started' },
              { id: 't-3', name: 'Relational Keys', status: 'not_started' },
            ],
          },
          {
            id: 'u-2',
            title: 'Unit 2: Design & Integrity',
            topics: [
              { id: 't-4', name: 'Normalization', status: 'not_started' },
              { id: 't-5', name: 'Transactions & ACID', status: 'not_started' },
            ],
          },
        ],
      },
    ],
    codingConfig: {
      languages: ['Java', 'Python', 'SQL'],
      schedule: {
        monday: 'Java',
        tuesday: 'Python',
        wednesday: 'SQL',
        thursday: 'Java',
        friday: 'Python',
        saturday: '',
        sunday: '',
      },
    },
    revisions: [],
    workoutHistory: [],
    habits: [],
    days: days,
    xpHistory: [],
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
    weightLog: [],
    achievements: INITIAL_ACHIEVEMENTS,
    notificationSettings: {
      enabled: false,
      workout: false,
      water: false,
      meals: false,
      study: false,
      coding: false,
      activity: false,
      sleep: false,
      journal: false,
      times: {
        workout: '17:30',
        water: '09:00',
        meals: '08:00',
        study: '09:00',
        coding: '14:30',
        activity: '19:00',
        journal: '21:30',
        sleep: '22:30',
      },
      lastSentLog: {},
    },
    preferences: {
      workoutDays: ['monday', 'wednesday', 'friday'],
      workoutTime: '17:30',
      studyDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      studyTime: '09:00',
      codingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      codingTime: '14:30',
    },
    morningCheckinDismissedDate: null,
    weeklyReviews: {},
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

    const emptyFresh = createEmptyWinterArcState();
    return {
      ...emptyFresh,
      ...parsed,
      user: { ...emptyFresh.user, ...(parsed.user || {}) },
      routineConfig: { ...emptyFresh.routineConfig, ...(parsed.routineConfig || {}) },
      routine: { ...emptyFresh.routine, ...(parsed.routine || {}) },
      courses: Array.isArray(parsed.courses) ? parsed.courses : emptyFresh.courses,
      codingConfig: { ...emptyFresh.codingConfig, ...(parsed.codingConfig || {}) },
      revisions: Array.isArray(parsed.revisions) ? parsed.revisions : [],
      workoutHistory: Array.isArray(parsed.workoutHistory) ? parsed.workoutHistory : [],
      notificationSettings: { ...emptyFresh.notificationSettings, ...(parsed.notificationSettings || {}) },
      preferences: { ...emptyFresh.preferences, ...(parsed.preferences || {}) },
      weeklyReviews: parsed.weeklyReviews || {},
    };
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
