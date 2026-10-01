import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ORDERED_WEEKDAYS,
  WEEKDAY_LABELS,
  getLastPerformanceForExercise,
  getNextIncompleteTopic,
} from '../utils/storage';
import {
  CalendarDays,
  Dumbbell,
  BookOpen,
  Code,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import Modal from '../components/common/Modal';

const POPULAR_LANGUAGES = [
  'Java',
  'Python',
  'C',
  'C++',
  'JavaScript',
  'TypeScript',
  'SQL',
  'Go',
  'Rust',
];

export default function RoutinePage() {
  const {
    data,
    updateDayRoutine,
    addExerciseToRoutine,
    editExerciseInRoutine,
    deleteExerciseFromRoutine,
    reorderExercisesInRoutine,
    addCourse,
    editCourse,
    deleteCourse,
    addUnitToCourse,
    addTopicToUnit,
    updateTopicStatus,
    deleteTopicFromUnit,
    updateCodingLanguages,
    showToast,
  } = useApp();

  const routine = data.routine || {};
  const courses = data.courses || [];
  const codingConfig = data.codingConfig || { languages: [], schedule: {} };
  const workoutHistory = data.workoutHistory || [];

  const [activeTab, setActiveTab] = useState('planner'); // 'planner' | 'courses' | 'coding'
  const [selectedDay, setSelectedDay] = useState('monday');

  // Exercise modal state
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exForm, setExForm] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    restTime: 60,
  });

  // Course modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    semester: 'Semester 1',
    priority: 'High',
    examDate: '',
  });

  // Topic modal state
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [selectedCourseForTopic, setSelectedCourseForTopic] = useState(null);
  const [selectedUnitForTopic, setSelectedUnitForTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({
    name: '',
    subtopic: '',
    difficulty: 'Medium',
    notes: '',
  });

  // Unit modal state
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [unitCourseId, setUnitCourseId] = useState(null);
  const [unitTitle, setUnitTitle] = useState('');

  const currentDayConfig = routine[selectedDay] || {
    workoutFocus: '',
    exercises: [],
    courseId: '',
    codingLang: '',
    other: '',
    isRestDay: false,
  };

  // Handlers for Day Routine
  const handleToggleRestDay = () => {
    updateDayRoutine(selectedDay, { isRestDay: !currentDayConfig.isRestDay });
  };

  const handleWorkoutFocusChange = (e) => {
    updateDayRoutine(selectedDay, { workoutFocus: e.target.value });
  };

  const handleCourseChange = (e) => {
    updateDayRoutine(selectedDay, { courseId: e.target.value });
  };

  const handleCodingChange = (e) => {
    updateDayRoutine(selectedDay, { codingLang: e.target.value });
  };

  const handleOtherChange = (e) => {
    updateDayRoutine(selectedDay, { other: e.target.value });
  };

  // Exercise handlers
  const openAddExercise = () => {
    setEditingExercise(null);
    setExForm({ name: '', sets: 3, reps: 10, weight: 0, restTime: 60 });
    setExerciseModalOpen(true);
  };

  const openEditExercise = (ex) => {
    setEditingExercise(ex);
    setExForm({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      restTime: ex.restTime,
    });
    setExerciseModalOpen(true);
  };

  const handleSaveExercise = (e) => {
    e.preventDefault();
    if (!exForm.name.trim()) {
      showToast('Please enter an exercise name', 'warning');
      return;
    }
    if (editingExercise) {
      editExerciseInRoutine(selectedDay, editingExercise.id, exForm);
    } else {
      addExerciseToRoutine(selectedDay, exForm);
    }
    setExerciseModalOpen(false);
  };

  // Course handlers
  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!courseForm.name.trim()) {
      showToast('Please enter a course name', 'warning');
      return;
    }
    addCourse(courseForm);
    setCourseForm({ name: '', code: '', semester: 'Semester 1', priority: 'High', examDate: '' });
    setCourseModalOpen(false);
  };

  const handleSaveUnit = (e) => {
    e.preventDefault();
    if (!unitTitle.trim()) return;
    addUnitToCourse(unitCourseId, unitTitle.trim());
    setUnitTitle('');
    setUnitModalOpen(false);
  };

  const handleSaveTopic = (e) => {
    e.preventDefault();
    if (!topicForm.name.trim()) {
      showToast('Please enter a topic name', 'warning');
      return;
    }
    addTopicToUnit(selectedCourseForTopic, selectedUnitForTopic, topicForm);
    setTopicForm({ name: '', subtopic: '', difficulty: 'Medium', notes: '' });
    setTopicModalOpen(false);
  };

  // Language setup handler
  const handleToggleLanguage = (lang) => {
    const list = codingConfig.languages || [];
    const exists = list.includes(lang);
    const updated = exists ? list.filter(l => l !== lang) : [...list, lang];
    updateCodingLanguages(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Top Banner */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold shadow-sm">
              <CalendarDays size={24} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block">
                SMART WEEKLY PLANNER
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                My Routine & Schedules
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Configure your weekly workout split, course syllabus, topics, and programming schedule.
              </p>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'planner'
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Weekly Planner
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'courses'
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Courses & Topics ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'coding'
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Coding Languages
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: WEEKLY PLANNER */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Day of Week Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {ORDERED_WEEKDAYS.map((dayKey) => {
              const dayObj = routine[dayKey] || {};
              const isSelected = selectedDay === dayKey;
              const isRest = dayObj.isRestDay;
              const course = courses.find(c => c.id === dayObj.courseId);

              return (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => setSelectedDay(dayKey)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-blue-100 shadow-sm'
                      : 'bg-white border-[#E2E8F0] hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-extrabold uppercase ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                      {dayKey.slice(0, 3)}
                    </span>
                    {isRest && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                        REST
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-semibold text-[#0F172A] truncate">
                    {isRest ? 'Recovery Day' : dayObj.workoutFocus || 'No workout'}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                    {course ? course.name : 'No study'}
                  </p>
                  <p className="text-[10px] text-[#2563EB] font-medium truncate">
                    {dayObj.codingLang || 'No code'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Day Configuration Panel */}
          <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block">
                  CONFIGURING SCHEDULE
                </span>
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  {WEEKDAY_LABELS[selectedDay]} Schedule
                </h2>
              </div>

              {/* Rest Day Switch */}
              <button
                type="button"
                onClick={handleToggleRestDay}
                className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                  currentDayConfig.isRestDay
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                <Coffee size={16} />
                <span>{currentDayConfig.isRestDay ? 'Recovery Day Enabled' : 'Mark as Rest / Recovery Day'}</span>
              </button>
            </div>

            {/* If Marked as Rest Day */}
            {currentDayConfig.isRestDay && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold block">Recovery Day Activated for {WEEKDAY_LABELS[selectedDay]}</span>
                  Skipping intense workouts on this day will not count as a failure. Focus on active recovery, light walks, hydration, and sleep.
                </div>
              </div>
            )}

            {/* 1. Workout Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell size={18} className="text-[#2563EB]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                    Workout Split & Exercises
                  </h3>
                </div>
                {!currentDayConfig.isRestDay && (
                  <button
                    type="button"
                    onClick={openAddExercise}
                    className="arc-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>+ Add Exercise</span>
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                  Workout Focus (Target Muscle Group)
                </label>
                <input
                  type="text"
                  value={currentDayConfig.workoutFocus}
                  onChange={handleWorkoutFocusChange}
                  placeholder="e.g. Chest + Triceps, Legs + Core, Pull Day..."
                  className="arc-input w-full"
                />
              </div>

              {/* Exercises List with Progression Comparison */}
              {(!currentDayConfig.exercises || currentDayConfig.exercises.length === 0) ? (
                <div className="p-5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center text-xs text-[#64748B]">
                  No exercises configured for {WEEKDAY_LABELS[selectedDay]} yet.
                  <button
                    type="button"
                    onClick={openAddExercise}
                    className="block mx-auto mt-2 text-[#2563EB] font-bold hover:underline"
                  >
                    + Add your first exercise
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentDayConfig.exercises.map((ex, idx) => {
                    const prev = getLastPerformanceForExercise(workoutHistory, ex.name);

                    return (
                      <div
                        key={ex.id}
                        className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold text-[#64748B] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-[#0F172A] block">{ex.name}</span>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B] mt-0.5">
                              <span><strong>{ex.sets}</strong> sets × <strong>{ex.reps}</strong> reps</span>
                              {ex.weight > 0 && <span>Weight: <strong>{ex.weight} kg</strong></span>}
                              <span>Rest: <strong>{ex.restTime}s</strong></span>
                            </div>
                            {/* Real workout progression indicator */}
                            {prev ? (
                              <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Previous ({prev.date}): {prev.weight}kg × {prev.reps} reps ({prev.sets} sets)
                              </span>
                            ) : (
                              <span className="inline-block mt-1 text-[10px] text-[#94A3B8]">
                                Previous: No prior log yet
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Exercise Controls */}
                        <div className="flex items-center gap-1 self-end sm:self-center">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => reorderExercisesInRoutine(selectedDay, idx, idx - 1)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-[#64748B]"
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                          )}
                          {idx < currentDayConfig.exercises.length - 1 && (
                            <button
                              type="button"
                              onClick={() => reorderExercisesInRoutine(selectedDay, idx, idx + 1)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-[#64748B]"
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditExercise(ex)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-[#2563EB]"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteExerciseFromRoutine(selectedDay, ex.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#DC2626]"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Study Schedule Section */}
            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#2563EB]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                    Study Plan & Course Assignment
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(true)}
                  className="text-xs text-[#2563EB] font-bold hover:underline"
                >
                  + Add New Course
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Assigned Course for {WEEKDAY_LABELS[selectedDay]}
                  </label>
                  <select
                    value={currentDayConfig.courseId || ''}
                    onChange={handleCourseChange}
                    className="arc-input w-full"
                  >
                    <option value="">-- No Course Assigned --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.code ? `(${c.code})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show Next Incomplete Topic Progression */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-bold text-[#64748B] block uppercase mb-1">
                    Automatic Topic Progression
                  </span>
                  {(() => {
                    const selCourse = courses.find(c => c.id === currentDayConfig.courseId);
                    if (!selCourse) {
                      return <span className="text-xs text-[#94A3B8]">Select a course to preview next topic</span>;
                    }
                    const nextTopic = getNextIncompleteTopic(selCourse);
                    if (nextTopic) {
                      return (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
                          <Sparkles size={14} />
                          <span>Next: {nextTopic.name} ({nextTopic.unitTitle})</span>
                        </div>
                      );
                    }
                    return <span className="text-xs text-emerald-600 font-bold">All topics completed for this course!</span>;
                  })()}
                </div>
              </div>
            </div>

            {/* 3. Coding Language & Other Schedule Section */}
            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-[#2563EB]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                  Coding & Other Priorities
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Coding Language / Project
                  </label>
                  <input
                    type="text"
                    value={currentDayConfig.codingLang || ''}
                    onChange={handleCodingChange}
                    placeholder="e.g. Java, Python, SQL, React Project..."
                    className="arc-input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Other Priority (Reading, System Design, Revision)
                  </label>
                  <input
                    type="text"
                    value={currentDayConfig.other || ''}
                    onChange={handleOtherChange}
                    placeholder="e.g. 20 Pages Reading, LeetCode contest..."
                    className="arc-input w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSES & TOPICS MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">My Courses & Syllabus</h2>
              <p className="text-xs text-[#64748B]">
                Create your courses, units, and topic progression checklist.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCourseModalOpen(true)}
              className="arc-btn-primary flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Add Course</span>
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="arc-card p-12 text-center bg-white border border-[#E2E8F0]">
              <BookOpen size={36} className="mx-auto text-[#64748B] mb-3 opacity-60" />
              <h3 className="text-base font-bold text-[#0F172A]">No courses created yet</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                Add your academic subjects (e.g. Data Structures, DBMS, Operating Systems) to track topic progression and automated revisions.
              </p>
              <button
                type="button"
                onClick={() => setCourseModalOpen(true)}
                className="arc-btn-primary mx-auto"
              >
                + Add Course
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => {
                const allTopics = (course.units || []).flatMap(u => u.topics || []);
                const completedTopics = allTopics.filter(t => t.status === 'completed');
                const progressPct = allTopics.length > 0 ? Math.round((completedTopics.length / allTopics.length) * 100) : 0;
                const nextTopic = getNextIncompleteTopic(course);

                return (
                  <div key={course.id} className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-5">
                    {/* Course Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-[#0F172A]">{course.name}</h3>
                          {course.code && (
                            <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold">
                              {course.code}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[#64748B] text-[10px] font-semibold">
                            {course.semester}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {completedTopics.length} of {allTopics.length} topics completed ({progressPct}%)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setUnitCourseId(course.id);
                            setUnitTitle('');
                            setUnitModalOpen(true);
                          }}
                          className="arc-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                        >
                          <Plus size={13} />
                          <span>+ Add Unit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCourse(course.id)}
                          className="p-2 rounded-lg text-[#DC2626] hover:bg-red-50"
                          title="Delete Course"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Next Topic Highlight */}
                    {nextTopic ? (
                      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Sparkles size={16} className="text-[#2563EB]" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                              NEXT INCOMPLETE TOPIC
                            </span>
                            <span className="text-xs font-bold text-[#0F172A]">{nextTopic.name} ({nextTopic.unitTitle})</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateTopicStatus(course.id, null, nextTopic.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Mark Completed
                        </button>
                      </div>
                    ) : allTopics.length > 0 ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                        🎉 All units and topics completed for this course!
                      </div>
                    ) : null}

                    {/* Units & Topics */}
                    <div className="space-y-4">
                      {(course.units || []).map((unit) => (
                        <div key={unit.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wide">
                              {unit.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCourseForTopic(course.id);
                                setSelectedUnitForTopic(unit.id);
                                setTopicForm({ name: '', subtopic: '', difficulty: 'Medium', notes: '' });
                                setTopicModalOpen(true);
                              }}
                              className="text-xs text-[#2563EB] font-bold hover:underline flex items-center gap-1"
                            >
                              <Plus size={13} />
                              <span>Add Topic</span>
                            </button>
                          </div>

                          {(!unit.topics || unit.topics.length === 0) ? (
                            <p className="text-xs text-[#94A3B8]">No topics in this unit yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {unit.topics.map((top) => {
                                const isDone = top.status === 'completed';
                                return (
                                  <div
                                    key={top.id}
                                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                                      isDone
                                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                                        : 'bg-white border-[#E2E8F0] text-[#0F172A]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateTopicStatus(
                                            course.id,
                                            unit.id,
                                            top.id,
                                            isDone ? 'not_started' : 'completed'
                                          )
                                        }
                                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                          isDone
                                            ? 'bg-emerald-600 border-emerald-600 text-white'
                                            : 'border-[#CBD5E1] hover:border-[#2563EB]'
                                        }`}
                                      >
                                        {isDone && <CheckCircle2 size={14} />}
                                      </button>
                                      <div>
                                        <span className={`text-xs font-bold block ${isDone ? 'line-through text-slate-500' : ''}`}>
                                          {top.name}
                                        </span>
                                        {top.subtopic && (
                                          <span className="text-[11px] text-[#64748B] block">{top.subtopic}</span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-[#64748B] font-semibold">
                                        {top.difficulty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => deleteTopicFromUnit(course.id, unit.id, top.id)}
                                        className="p-1 rounded text-[#94A3B8] hover:text-[#DC2626]"
                                        title="Delete topic"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROGRAMMING LANGUAGES */}
      {activeTab === 'coding' && (
        <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Programming Languages & Schedule</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Select your languages to build a focused coding curriculum across the 100 days.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-3">
              Select Your Languages
            </label>
            <div className="flex flex-wrap gap-2.5">
              {POPULAR_LANGUAGES.map((lang) => {
                const isSelected = (codingConfig.languages || []).includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleToggleLanguage(lang)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                        : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A] hover:bg-slate-100'
                    }`}
                  >
                    {lang} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">
              Weekly Coding Schedule Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {ORDERED_WEEKDAYS.map((dayKey) => {
                const currentLang = routine[dayKey]?.codingLang || 'None';
                return (
                  <div key={dayKey} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">
                      {dayKey.slice(0, 3)}
                    </span>
                    <span className="text-xs font-bold text-[#2563EB] block mt-1">
                      {currentLang}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EXERCISE */}
      <Modal
        isOpen={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        title={editingExercise ? 'Edit Exercise' : 'Add Exercise to Split'}
      >
        <form onSubmit={handleSaveExercise} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">Exercise Name</label>
            <input
              type="text"
              value={exForm.name}
              onChange={(e) => setExForm({ ...exForm, name: e.target.value })}
              placeholder="e.g. Bench Press, Incline DB Press, Cable Fly..."
              className="arc-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Sets</label>
              <input
                type="number"
                min="1"
                value={exForm.sets}
                onChange={(e) => setExForm({ ...exForm, sets: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Reps</label>
              <input
                type="number"
                min="1"
                value={exForm.reps}
                onChange={(e) => setExForm({ ...exForm, reps: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={exForm.weight}
                onChange={(e) => setExForm({ ...exForm, weight: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Rest (sec)</label>
              <input
                type="number"
                step="15"
                min="15"
                value={exForm.restTime}
                onChange={(e) => setExForm({ ...exForm, restTime: e.target.value })}
                className="arc-input w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setExerciseModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Save Exercise
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD COURSE */}
      <Modal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        title="Add New Course"
      >
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">Course Name</label>
            <input
              type="text"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              placeholder="e.g. Data Structures & Algorithms, DBMS, Operating Systems"
              className="arc-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Course Code</label>
              <input
                type="text"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                placeholder="e.g. CS201"
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Semester</label>
              <input
                type="text"
                value={courseForm.semester}
                onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                placeholder="e.g. Semester 3"
                className="arc-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Priority</label>
              <select
                value={courseForm.priority}
                onChange={(e) => setCourseForm({ ...courseForm, priority: e.target.value })}
                className="arc-input w-full"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Exam Date (Optional)</label>
              <input
                type="date"
                value={courseForm.examDate}
                onChange={(e) => setCourseForm({ ...courseForm, examDate: e.target.value })}
                className="arc-input w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCourseModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Create Course
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD UNIT */}
      <Modal
        isOpen={unitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        title="Add Unit to Course"
      >
        <form onSubmit={handleSaveUnit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">Unit Title</label>
            <input
              type="text"
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              placeholder="e.g. Unit 2: Trees & Graph Algorithms"
              className="arc-input w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setUnitModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Add Unit
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD TOPIC */}
      <Modal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        title="Add Topic"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">Topic Name</label>
            <input
              type="text"
              value={topicForm.name}
              onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              placeholder="e.g. Binary Search Trees, Normalization 3NF, Deadlocks..."
              className="arc-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Subtopic (Optional)</label>
              <input
                type="text"
                value={topicForm.subtopic}
                onChange={(e) => setTopicForm({ ...topicForm, subtopic: e.target.value })}
                placeholder="e.g. Inorder Traversal, BCNF..."
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Difficulty</label>
              <select
                value={topicForm.difficulty}
                onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value })}
                className="arc-input w-full"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">Notes (Optional)</label>
            <textarea
              value={topicForm.notes}
              onChange={(e) => setTopicForm({ ...topicForm, notes: e.target.value })}
              placeholder="Key concepts, textbook references..."
              className="arc-input w-full h-20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTopicModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Add Topic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
