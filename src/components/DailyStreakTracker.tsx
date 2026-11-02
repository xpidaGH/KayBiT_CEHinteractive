import React, { useState, useEffect } from 'react';
import {
  Flame,
  Calendar,
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export interface StudyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalActiveDays: number;
  history: Record<string, boolean>; // e.g. { "2026-11-01": true }
  unlockedMilestones: string[];
}

const STREAK_STORAGE_KEY = 'kaybit_ceh_study_streak_v1';

// Helper to get local date string YYYY-MM-DD
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get date string offset by days
const getDateOffset = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const STREAK_MILESTONES = [
  { id: 'm3', name: 'Cyber Cadet', days: 3, icon: '🥉', desc: 'Study for 3 consecutive days' },
  { id: 'm7', name: 'Packet Master', days: 7, icon: '🥈', desc: 'Complete 1 full week streak' },
  { id: 'm14', name: 'Exploit Sentinel', days: 14, icon: '🥇', desc: 'Maintain 2 weeks of disciplined practice' },
  { id: 'm30', name: 'CEH Elite Hacker', days: 30, icon: '👑', desc: 'Reach 30 consecutive study days' }
];

export const loadStreakData = (): StudyStreakData => {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      const data: StudyStreakData = JSON.parse(raw);
      return data;
    }
  } catch (e) {
    console.warn('Failed to load streak data:', e);
  }

  // Initial default streak with today seeded as active
  const today = getTodayDateString();
  const yesterday = getDateOffset(-1);
  const twoDaysAgo = getDateOffset(-2);

  const initial: StudyStreakData = {
    currentStreak: 3,
    longestStreak: 5,
    lastActiveDate: today,
    totalActiveDays: 8,
    history: {
      [twoDaysAgo]: true,
      [yesterday]: true,
      [today]: true
    },
    unlockedMilestones: ['m3']
  };

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // Ignore storage issues
  }
  return initial;
};

/**
 * Global function to record user study activity from any module
 */
export const recordDailyStudyActivity = (): StudyStreakData => {
  const current = loadStreakData();
  const today = getTodayDateString();
  const yesterday = getDateOffset(-1);

  let newCurrent = current.currentStreak;
  let newLongest = current.longestStreak;
  let newTotal = current.totalActiveDays;
  const newHistory = { ...current.history };

  if (!newHistory[today]) {
    newHistory[today] = true;
    newTotal += 1;

    if (current.lastActiveDate === yesterday) {
      // Consecutive day!
      newCurrent += 1;
    } else if (current.lastActiveDate === today) {
      // Already today
    } else {
      // Streak broken, restart at 1
      newCurrent = 1;
    }

    if (newCurrent > newLongest) {
      newLongest = newCurrent;
    }
  }

  // Check milestones
  const unlocked = [...current.unlockedMilestones];
  STREAK_MILESTONES.forEach((m) => {
    if (newCurrent >= m.days && !unlocked.includes(m.id)) {
      unlocked.push(m.id);
    }
  });

  const updated: StudyStreakData = {
    currentStreak: newCurrent,
    longestStreak: newLongest,
    lastActiveDate: today,
    totalActiveDays: newTotal,
    history: newHistory,
    unlockedMilestones: unlocked
  };

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ceh-streak-updated', { detail: updated }));
  } catch (e) {
    console.warn('Failed to save streak update:', e);
  }

  return updated;
};

export const DailyStreakTracker: React.FC = () => {
  const [streakData, setStreakData] = useState<StudyStreakData>(loadStreakData);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [justCheckedIn, setJustCheckedIn] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setStreakData(e.detail);
      } else {
        setStreakData(loadStreakData());
      }
    };

    window.addEventListener('ceh-streak-updated', handleUpdate);
    window.addEventListener('ceh-activity-recorded', handleUpdate);

    // Initial check on mount
    recordDailyStudyActivity();

    return () => {
      window.removeEventListener('ceh-streak-updated', handleUpdate);
      window.removeEventListener('ceh-activity-recorded', handleUpdate);
    };
  }, []);

  const todayStr = getTodayDateString();
  const isActiveToday = Boolean(streakData.history[todayStr]);

  const handleManualCheckIn = () => {
    const updated = recordDailyStudyActivity();
    setStreakData(updated);
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 2500);
  };

  // Generate past 7 days list
  const pastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i;
    const dateStr = getDateOffset(-offset);
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const isCompleted = Boolean(streakData.history[dateStr]);
    const isToday = offset === 0;

    return {
      dateStr,
      dayName,
      dayNum,
      isCompleted,
      isToday
    };
  });

  return (
    <>
      {/* Header Streak Indicator Badge */}
      <button
        id="btn-daily-streak-tracker"
        type="button"
        className={`btn btn-sm d-flex align-items-center gap-1.5 px-2.5 py-1 border transition-all ${
          isActiveToday
            ? 'bg-amber-950/40 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:bg-amber-900/50'
            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-light'
        }`}
        style={{ borderRadius: 'var(--app-btn-radius, 0.375rem)' }}
        onClick={() => setShowModal(true)}
        title={`Daily Study Streak: ${streakData.currentStreak} consecutive days. Click to view history & milestones.`}
      >
        <Flame
          size={16}
          className={`${
            isActiveToday ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-zinc-500'
          }`}
        />
        <span className="fw-bold font-monospace" style={{ fontSize: '0.82rem' }}>
          {streakData.currentStreak} {streakData.currentStreak === 1 ? 'Day' : 'Days'}
        </span>
        <span
          className="badge bg-black bg-opacity-60 text-warning px-1.5 py-0.5 ms-0.5 border border-warning border-opacity-30 d-none d-md-inline"
          style={{ fontSize: '0.65rem' }}
        >
          {isActiveToday ? 'ACTIVE' : 'READY'}
        </span>
      </button>

      {/* Streak Details Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm"
          style={{ position: 'fixed', inset: 0, zIndex: 1050 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            className="card bg-dark border-secondary shadow-2xl text-light w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ borderRadius: 'var(--app-card-radius, 0.75rem)' }}
          >
            {/* Modal Header */}
            <div className="card-header bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded-3 bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30">
                  <Flame size={20} className="fill-warning" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold text-light">Daily Study Streak Tracker</h5>
                  <div className="text-secondary small">Consistency Engine • CEH v13 Preparation</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm p-1.5 text-light"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="card-body p-4">
              {/* Flame Hero Counter */}
              <div className="p-4 mb-4 rounded-3 text-center bg-gradient-to-b from-amber-500/15 via-black/40 to-black/60 border border-amber-500/30">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 mb-2 border border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                  <Flame size={36} className="fill-amber-400" />
                </div>
                <div className="display-5 fw-bold text-light font-monospace">
                  {streakData.currentStreak} {streakData.currentStreak === 1 ? 'Day' : 'Days'}
                </div>
                <div className="text-amber-300 small fw-semibold mt-1">
                  {isActiveToday
                    ? '🔥 Your flame is burning! Today’s study goal is accomplished.'
                    : '⚡ Study any module or complete a quiz today to extend your streak!'}
                </div>

                <div className="d-flex justify-content-center gap-4 mt-3 pt-3 border-top border-secondary border-opacity-30">
                  <div>
                    <div className="text-secondary small" style={{ fontSize: '0.72rem' }}>
                      LONGEST STREAK
                    </div>
                    <div className="fw-bold text-light font-monospace fs-6">
                      🏆 {streakData.longestStreak} Days
                    </div>
                  </div>
                  <div className="border-end border-secondary border-opacity-30" />
                  <div>
                    <div className="text-secondary small" style={{ fontSize: '0.72rem' }}>
                      TOTAL SESSIONS
                    </div>
                    <div className="fw-bold text-light font-monospace fs-6">
                      📅 {streakData.totalActiveDays} Days
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day Activity Calendar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-secondary fw-semibold">PAST 7 DAYS ACTIVITY</span>
                  <span className="badge bg-black text-secondary border border-secondary" style={{ fontSize: '0.7rem' }}>
                    Auto-tracked via LocalStorage
                  </span>
                </div>
                <div className="d-grid grid-cols-7 gap-2 text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {pastSevenDays.map((d) => (
                    <div
                      key={d.dateStr}
                      className={`p-2 rounded-2 border text-center transition-all ${
                        d.isCompleted
                          ? 'bg-amber-500 bg-opacity-15 border-amber-500 border-opacity-40 text-amber-300'
                          : d.isToday
                          ? 'bg-secondary bg-opacity-20 border-secondary text-secondary'
                          : 'bg-black bg-opacity-40 border-secondary border-opacity-30 text-muted'
                      }`}
                    >
                      <div className="small fw-semibold" style={{ fontSize: '0.68rem' }}>
                        {d.dayName}
                      </div>
                      <div className="fw-bold my-1" style={{ fontSize: '0.85rem' }}>
                        {d.dayNum}
                      </div>
                      <div className="d-flex justify-content-center">
                        {d.isCompleted ? (
                          <Flame size={14} className="text-amber-400 fill-amber-400" />
                        ) : (
                          <div className="rounded-full bg-secondary bg-opacity-30" style={{ width: '6px', height: '6px' }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Badges */}
              <div className="mb-3">
                <div className="small text-secondary fw-semibold mb-2">STREAK MILESTONES</div>
                <div className="row g-2">
                  {STREAK_MILESTONES.map((m) => {
                    const isUnlocked = streakData.unlockedMilestones.includes(m.id);
                    return (
                      <div key={m.id} className="col-6">
                        <div
                          className={`p-2.5 rounded-2 border d-flex align-items-center gap-2 ${
                            isUnlocked
                              ? 'bg-black bg-opacity-50 border-warning border-opacity-40 text-light'
                              : 'bg-black bg-opacity-20 border-secondary border-opacity-20 text-secondary opacity-60'
                          }`}
                        >
                          <span className="fs-5">{m.icon}</span>
                          <div className="overflow-hidden">
                            <div className="fw-bold small text-truncate d-flex align-items-center gap-1">
                              <span>{m.name}</span>
                              {isUnlocked && <CheckCircle2 size={12} className="text-success flex-shrink-0" />}
                            </div>
                            <div className="text-secondary text-truncate" style={{ fontSize: '0.68rem' }}>
                              {m.days} days required
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="card-footer bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex justify-content-between align-items-center">
              <button
                type="button"
                className={`btn btn-sm ${
                  justCheckedIn ? 'btn-success' : 'btn-outline-warning'
                } d-flex align-items-center gap-1.5`}
                onClick={handleManualCheckIn}
              >
                <Zap size={14} />
                <span>{justCheckedIn ? 'Today Logged!' : 'Log Active Study Now'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm px-3"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
