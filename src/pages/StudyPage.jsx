import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  getDateForDay,
  formatReadableDate,
  getNextIncompleteTopic,
} from '../utils/storage';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';

export default function StudyPage() {
  const {
    data,
    activeDayNumber,
    currentDayData,
    addStudy,
    updateTopicStatus,
    completeRevision,
    isFutureDay,
  } = useApp();

  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'curriculum' | 'revisions'
  const [modalOpen, setModalOpen] = useState(false);

  const courses = data.courses || [];
  const revisions = data.revisions || [];
  const dateStr = getDateForDay(activeDayNumber);

  const [form, setForm] = useState({
    subject: courses[0]?.name || 'DSA',
    topic: '',
    durationMinutes: 60,
    questionsSolved: 2,
    notes: '',
    markTopicCompleted: false,
    courseId: courses[0]?.id || '',
  });

  const isFuture = isFutureDay(activeDayNumber);
  const currentStudyList = currentDayData?.study || [];
  const totalHours = data.stats?.totalStudyHours || 0;

  // Aggregate subject breakdown from all real recorded study across days
  const subjectBreakdown = useMemo(() => {
    const map = {};
    Object.values(data.days || {}).forEach(d => {
      (d.study || []).forEach(s => {
        const sub = s.subject || 'Other';
        map[sub] = (map[sub] || 0) + (Number(s.durationMinutes) || 0);
      });
    });
    return Object.entries(map).map(([name, mins]) => ({
      subject: name,
      hours: Math.round((mins / 60) * 10) / 10,
    }));
  }, [data.days]);

  // Revisions due today and upcoming
  const dueTodayRevisions = revisions.filter(r => r.dueDate === dateStr && !r.completed);
  const upcomingRevisions = revisions.filter(r => r.dueDate > dateStr && !r.completed);
  const completedRevisions = revisions.filter(r => r.completed);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    addStudy(activeDayNumber, form);

    // If user checked mark topic completed and course selected
    if (form.markTopicCompleted && form.courseId) {
      const course = courses.find(c => c.id === form.courseId);
      const nextTopic = getNextIncompleteTopic(course);
      if (nextTopic) {
        updateTopicStatus(course.id, null, nextTopic.id, 'completed', activeDayNumber);
      }
    }

    setForm({
      subject: courses[0]?.name || 'DSA',
      topic: '',
      durationMinutes: 60,
      questionsSolved: 2,
      notes: '',
      markTopicCompleted: false,
      courseId: courses[0]?.id || '',
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            ACADEMIC & COGNITIVE MASTERY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            Study, Topics & Spaced Revision
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Track subjects, concepts covered, topic progression, and automated 1, 3, 7, 14-day spaced reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isFuture && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="arc-btn-primary text-xs"
            >
              <Plus size={16} />
              <span>Log Study Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'sessions'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Daily Sessions & Breakdown
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'curriculum'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Topic Progression ({courses.length} courses)
        </button>
        <button
          onClick={() => setActiveTab('revisions')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'revisions'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <span>Spaced Revisions</span>
          {dueTodayRevisions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {dueTodayRevisions.length} due
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: SESSIONS & KPI CARDS */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
              <span className="text-xs font-semibold text-[#64748B] block">Total Study Hours</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                {totalHours}h
              </div>
              <span className="text-[11px] text-[#64748B] block mt-1">Verified logged hours</span>
            </div>

            <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
              <span className="text-xs font-semibold text-[#64748B] block">Day {activeDayNumber} Study</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1">
                {currentStudyList.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0)} mins
              </div>
              <span className="text-[11px] text-[#64748B] block mt-1">
                {currentStudyList.length} session(s) clocked
              </span>
            </div>

            <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
              <span className="text-xs font-semibold text-[#64748B] block">Questions Solved Today</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                {currentStudyList.reduce((acc, s) => acc + (Number(s.questionsSolved) || 0), 0)} Qs
              </div>
              <span className="text-[11px] text-[#64748B] block mt-1">Practice questions</span>
            </div>
          </div>

          {/* Subject Breakdown Chart */}
          <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Subject Deep Work Distribution</h3>
                <p className="text-xs text-[#64748B]">Accumulated focus hours per course / subject</p>
              </div>
            </div>

            {subjectBreakdown.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No study data yet"
                description="Log your first study session to see your progress."
                actionLabel="Log Study Session"
                onAction={() => setModalOpen(true)}
              />
            ) : (
              <div className="h-60 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(val) => [`${val} hrs`, 'Deep Work']}
                    />
                    <Bar dataKey="hours" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Today's Logged Study Sessions */}
          <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">
              Day {activeDayNumber} Study Sessions
            </h3>

            {currentStudyList.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">No study sessions logged for Day {activeDayNumber} yet.</p>
            ) : (
              <div className="space-y-3">
                {currentStudyList.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">{s.subject} · {s.topic}</span>
                      <span className="text-[11px] text-[#64748B] block mt-0.5">
                        {s.durationMinutes} mins · {s.questionsSolved || 0} questions solved
                      </span>
                      {s.notes && <p className="text-xs text-[#475569] mt-1">{s.notes}</p>}
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] font-bold text-xs">
                      {s.durationMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC PROGRESSION */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Course & Topic Progression</h2>
              <p className="text-xs text-[#64748B]">
                Completing a topic marks it done and automatically generates spaced revisions for 1, 3, 7, and 14 days later.
              </p>
            </div>
            <Link to="/routine" className="arc-btn-secondary text-xs">
              Manage Courses in Routine →
            </Link>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses configured yet"
              description="Add your courses and units in the Routine section to enable topic progression."
              actionLabel="Go to My Routine"
              onAction={() => {}}
            />
          ) : (
            <div className="space-y-6">
              {courses.map((course) => {
                const nextTopic = getNextIncompleteTopic(course);
                const allTopics = (course.units || []).flatMap(u => u.topics || []);

                return (
                  <div key={course.id} className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                      <div>
                        <h3 className="text-base font-bold text-[#0F172A]">{course.name}</h3>
                        <span className="text-xs text-[#64748B]">
                          {allTopics.filter(t => t.status === 'completed').length} of {allTopics.length} topics completed
                        </span>
                      </div>
                      {nextTopic && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EFF6FF] border border-blue-200 text-xs font-bold text-[#2563EB]">
                          <Sparkles size={13} />
                          <span>Next: {nextTopic.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {(course.units || []).map((unit) => (
                        <div key={unit.id} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                          <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">
                            {unit.title}
                          </span>

                          <div className="space-y-1.5">
                            {(unit.topics || []).map((topic) => {
                              const isDone = topic.status === 'completed';
                              return (
                                <div
                                  key={topic.id}
                                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                                    isDone
                                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                                      : 'bg-white border-[#E2E8F0] text-[#0F172A]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateTopicStatus(
                                          course.id,
                                          unit.id,
                                          topic.id,
                                          isDone ? 'not_started' : 'completed',
                                          activeDayNumber
                                        )
                                      }
                                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#CBD5E1]'
                                      }`}
                                    >
                                      {isDone && <CheckCircle2 size={12} />}
                                    </button>
                                    <span className={isDone ? 'line-through' : 'font-semibold'}>
                                      {topic.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-[#64748B] font-medium">
                                      {topic.difficulty}
                                    </span>
                                    {isDone && (
                                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                                        Revisions Active
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
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

      {/* TAB 3: SPACED REPETITION REVISIONS */}
      {activeTab === 'revisions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Spaced Repetition Schedule</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Automated review checkpoints at 1 day, 3 days, 7 days, and 14 days after completing each syllabus topic.
            </p>
          </div>

          {/* Revisions Due Today */}
          <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <RotateCcw size={16} className="text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Due for Review Today ({dueTodayRevisions.length})
              </h3>
            </div>

            {dueTodayRevisions.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">No revisions due today. Great job staying ahead!</p>
            ) : (
              <div className="space-y-2.5">
                {dueTodayRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">{rev.topicName}</span>
                      <span className="text-[11px] text-[#64748B]">
                        {rev.courseName} · {rev.intervalDays}-day review interval
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => completeRevision(rev.id, activeDayNumber)}
                      className="arc-btn-primary text-xs py-1.5 px-3"
                    >
                      Complete Review (+20 XP)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Revisions */}
          <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] pb-3 border-b border-[#E2E8F0]">
              Upcoming Revisions ({upcomingRevisions.length})
            </h3>

            {upcomingRevisions.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">
                No upcoming revisions scheduled. When you mark topics as completed, 1d, 3d, 7d, and 14d reviews appear here automatically.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingRevisions.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#0F172A] block">{rev.topicName}</span>
                      <span className="text-[11px] text-[#64748B]">
                        {rev.courseName} · {rev.intervalDays}d review
                      </span>
                    </div>
                    <span className="font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                      Due: {rev.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Log Study Session */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Study Session" subtitle={`Day ${activeDayNumber}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Subject / Course</label>
            <select
              value={form.subject}
              onChange={e => {
                const sel = courses.find(c => c.name === e.target.value);
                setForm({ ...form, subject: e.target.value, courseId: sel?.id || '' });
              }}
              className="w-full arc-input"
            >
              {courses.length > 0 ? (
                courses.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))
              ) : (
                <>
                  <option value="DSA">Data Structures & Algorithms</option>
                  <option value="DBMS">Database Management Systems</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="System Design">System Design</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Topic Covered</label>
            <input
              type="text"
              required
              placeholder="e.g. Binary Search Trees, Normalization..."
              value={form.topic}
              onChange={e => setForm({ ...form, topic: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="5"
                value={form.durationMinutes}
                onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Questions Solved</label>
              <input
                type="number"
                min="0"
                value={form.questionsSolved}
                onChange={e => setForm({ ...form, questionsSolved: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Notes</label>
            <textarea
              placeholder="Key concepts, takeaways, formulas..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full arc-input h-20 resize-none"
            />
          </div>

          {form.courseId && (
            <label className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.markTopicCompleted}
                onChange={e => setForm({ ...form, markTopicCompleted: e.target.checked })}
                className="rounded border-[#CBD5E1] text-[#2563EB]"
              />
              <span className="text-xs font-bold text-[#0F172A]">
                Mark current topic complete and schedule 1, 3, 7, 14-day spaced revisions
              </span>
            </label>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="arc-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary text-xs">
              Save Session (+XP)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
