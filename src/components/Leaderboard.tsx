import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  Legend
} from 'recharts';
import {
  Trophy,
  Award,
  TrendingUp,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Filter,
  Trash2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers
} from 'lucide-react';
import { QuizScoreRecord } from '../types';

interface LeaderboardProps {
  quizHistory: QuizScoreRecord[];
  onTakeQuiz?: () => void;
  onClearHistory?: () => void;
  onAddSampleHistory?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  quizHistory,
  onTakeQuiz,
  onClearHistory,
  onAddSampleHistory
}) => {
  const [selectedMode, setSelectedMode] = useState<'all' | 'exam' | 'practice'>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [chartMetric, setChartMetric] = useState<'timeline' | 'domain'>('timeline');

  // Filter history records
  const filteredHistory = useMemo(() => {
    return quizHistory.filter((record) => {
      if (selectedMode !== 'all' && record.mode !== selectedMode) return false;
      if (selectedDomain !== 'all' && record.domainCode !== selectedDomain) return false;
      return true;
    });
  }, [quizHistory, selectedMode, selectedDomain]);

  // Distinct domains present in history
  const distinctDomains = useMemo(() => {
    const set = new Set<string>();
    quizHistory.forEach((r) => {
      if (r.domainCode) set.add(r.domainCode);
    });
    return Array.from(set).sort();
  }, [quizHistory]);

  // Timeline chart data: sorted chronologically (oldest to newest)
  const timelineData = useMemo(() => {
    const sorted = [...filteredHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sorted.map((record, index) => {
      const dateObj = new Date(record.date);
      const dateFormatted = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })
        : `Test ${index + 1}`;

      const timeFormatted = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
          })
        : '';

      return {
        id: record.id,
        attemptLabel: `#${index + 1} (${dateFormatted})`,
        fullDate: `${dateFormatted} ${timeFormatted}`,
        score: record.score,
        correctAnswers: record.correctAnswers,
        totalQuestions: record.totalQuestions,
        domainCode: record.domainCode || 'All Domains',
        domainName: record.domainName || 'Comprehensive',
        mode: record.mode === 'exam' ? 'Exam Simulation' : 'Practice Mode',
        timeSpent: record.timeSpentSeconds
          ? `${Math.floor(record.timeSpentSeconds / 60)}m ${record.timeSpentSeconds % 60}s`
          : 'N/A'
      };
    });
  }, [filteredHistory]);

  // Domain performance chart data: Best score per domain
  const domainBestData = useMemo(() => {
    const domainMap = new Map<string, { maxScore: number; attempts: number; domainName: string }>();

    filteredHistory.forEach((r) => {
      const code = r.domainCode || 'All Modules';
      const name = r.domainName || 'Comprehensive Exam';
      const existing = domainMap.get(code) || { maxScore: 0, attempts: 0, domainName: name };

      domainMap.set(code, {
        maxScore: Math.max(existing.maxScore, r.score),
        attempts: existing.attempts + 1,
        domainName: name
      });
    });

    return Array.from(domainMap.entries()).map(([code, stats]) => ({
      domainCode: code,
      domainLabel: code,
      bestScore: stats.maxScore,
      attempts: stats.attempts,
      domainName: stats.domainName
    }));
  }, [filteredHistory]);

  // High Scores Leaderboard: Sorted by score descending (highest score first)
  const rankedRecords = useMemo(() => {
    return [...filteredHistory].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tiebreaker: Higher correct answers, or fewer seconds spent
      if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
      return (a.timeSpentSeconds || 9999) - (b.timeSpentSeconds || 9999);
    });
  }, [filteredHistory]);

  // Summary Metrics
  const summaryStats = useMemo(() => {
    if (filteredHistory.length === 0) {
      return {
        totalAttempts: 0,
        highestScore: 0,
        averageScore: 0,
        passingRate: 0,
        totalQuestionsAnswered: 0
      };
    }

    const highest = Math.max(...filteredHistory.map((r) => r.score));
    const sumScore = filteredHistory.reduce((acc, r) => acc + r.score, 0);
    const avg = Math.round(sumScore / filteredHistory.length);
    const passingCount = filteredHistory.filter((r) => r.score >= 75).length;
    const passRate = Math.round((passingCount / filteredHistory.length) * 100);
    const totalQ = filteredHistory.reduce((acc, r) => acc + r.totalQuestions, 0);

    return {
      totalAttempts: filteredHistory.length,
      highestScore: highest,
      averageScore: avg,
      passingRate: passRate,
      totalQuestionsAnswered: totalQ
    };
  }, [filteredHistory]);

  // Custom Chart Tooltip
  const CustomTimelineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="p-3 rounded shadow-lg border border-secondary"
          style={{ backgroundColor: '#161b22', color: '#f0f6fc', minWidth: '220px' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold text-light">{data.attemptLabel}</span>
            <span
              className={`badge ${
                data.score >= 75
                  ? 'bg-success'
                  : data.score >= 50
                  ? 'bg-warning text-dark'
                  : 'bg-danger'
              }`}
            >
              {data.score}%
            </span>
          </div>

          <div className="small text-secondary mb-2">{data.fullDate}</div>

          <div className="border-top border-secondary pt-2 small">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-secondary">Result:</span>
              <span className="fw-semibold text-light">
                {data.correctAnswers} / {data.totalQuestions} Correct
              </span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-secondary">Domain:</span>
              <span className="text-info text-truncate" style={{ maxWidth: '140px' }}>
                {data.domainCode}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-secondary">Mode:</span>
              <span className="text-light">{data.mode}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Duration:</span>
              <span className="text-light">{data.timeSpent}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-fluid px-3 py-4 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
              <Trophy size={26} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="mb-0 text-light fw-bold">CEH Personal Leaderboard</h4>
                <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30">
                  {quizHistory.length} Recorded Attempts
                </span>
              </div>
              <small className="text-secondary">
                Track personal high scores, visualize score progression over time, and analyze passing readiness
              </small>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            {onTakeQuiz && (
              <button
                id="btn-leaderboard-take-quiz"
                className="btn btn-sm btn-info text-dark fw-bold d-flex align-items-center gap-1.5 shadow-sm"
                onClick={onTakeQuiz}
              >
                <PlayCircle size={15} />
                <span>Take Mock Quiz</span>
              </button>
            )}

            {quizHistory.length === 0 && onAddSampleHistory && (
              <button
                id="btn-leaderboard-sample"
                className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1.5"
                onClick={onAddSampleHistory}
                title="Load realistic practice scores to preview the leaderboard chart"
              >
                <Sparkles size={14} />
                <span>Load Sample Scores</span>
              </button>
            )}

            {quizHistory.length > 0 && onClearHistory && (
              <button
                id="btn-leaderboard-clear"
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your quiz history records?')) {
                    onClearHistory();
                  }
                }}
                title="Clear all recorded quiz scores"
              >
                <Trash2 size={14} />
                <span className="d-none d-sm-inline">Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="row g-2 mt-2 pt-2 border-top border-secondary align-items-center">
          {/* Mode Selector */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
                <Filter size={13} />
              </span>
              <select
                id="select-leaderboard-mode"
                className="form-select form-select-sm bg-dark text-light border-secondary"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value as any)}
                aria-label="Filter by test mode"
              >
                <option value="all">All Test Modes</option>
                <option value="exam">Exam Simulations Only</option>
                <option value="practice">Practice Mode Only</option>
              </select>
            </div>
          </div>

          {/* Domain Selector */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <select
              id="select-leaderboard-domain"
              className="form-select form-select-sm bg-dark text-light border-secondary"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              aria-label="Filter by domain"
            >
              <option value="all">All Domains / Scopes</option>
              {distinctDomains.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Chart View Toggle */}
          <div className="col-12 col-md-4 col-lg-6 d-flex justify-content-md-end align-items-center gap-2">
            <div className="btn-group btn-group-sm border border-secondary rounded">
              <button
                id="btn-chart-timeline"
                className={`btn ${
                  chartMetric === 'timeline'
                    ? 'btn-info text-dark fw-semibold'
                    : 'btn-dark text-secondary'
                }`}
                onClick={() => setChartMetric('timeline')}
                title="View Score Progression Over Time"
              >
                <TrendingUp size={13} className="me-1" />
                <span>Timeline Trend</span>
              </button>
              <button
                id="btn-chart-domain"
                className={`btn ${
                  chartMetric === 'domain'
                    ? 'btn-info text-dark fw-semibold'
                    : 'btn-dark text-secondary'
                }`}
                onClick={() => setChartMetric('domain')}
                title="View Best Scores by CEH Domain"
              >
                <Layers size={13} className="me-1" />
                <span>Domain Highs</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Personal Best High Score */}
        <div className="col-6 col-lg-3">
          <div className="card bg-dark border-secondary p-3 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Personal Best
              </span>
              <div className="p-1.5 rounded bg-warning bg-opacity-10 text-warning">
                <Trophy size={16} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h2 className="text-light fw-bold mb-0">
                {summaryStats.highestScore}%
              </h2>
              {summaryStats.highestScore >= 75 && (
                <span className="badge bg-success bg-opacity-25 text-success small">
                  PASS
                </span>
              )}
            </div>
            <small className="text-secondary mt-1 d-block">
              {summaryStats.highestScore >= 75
                ? 'Exceeds CEH 75% Cut Score'
                : 'Target: 75% for CEH Certification'}
            </small>
          </div>
        </div>

        {/* Passing Rate */}
        <div className="col-6 col-lg-3">
          <div className="card bg-dark border-secondary p-3 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Passing Rate
              </span>
              <div className="p-1.5 rounded bg-success bg-opacity-10 text-success">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h2 className="text-light fw-bold mb-0">{summaryStats.passingRate}%</h2>
              <span className="text-secondary small">
                ({filteredHistory.filter((r) => r.score >= 75).length}/{filteredHistory.length})
              </span>
            </div>
            <small className="text-secondary mt-1 d-block">
              Attempts scoring ≥ 75%
            </small>
          </div>
        </div>

        {/* Average Score */}
        <div className="col-6 col-lg-3">
          <div className="card bg-dark border-secondary p-3 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Average Score
              </span>
              <div className="p-1.5 rounded bg-info bg-opacity-10 text-info">
                <BarChart3 size={16} />
              </div>
            </div>
            <h2 className="text-light fw-bold mb-0">{summaryStats.averageScore}%</h2>
            <small className="text-secondary mt-1 d-block">
              Across all recorded sessions
            </small>
          </div>
        </div>

        {/* Total Questions Solved */}
        <div className="col-6 col-lg-3">
          <div className="card bg-dark border-secondary p-3 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Total Practiced
              </span>
              <div className="p-1.5 rounded bg-primary bg-opacity-10 text-primary">
                <Target size={16} />
              </div>
            </div>
            <h2 className="text-light fw-bold mb-0">{summaryStats.totalQuestionsAnswered}</h2>
            <small className="text-secondary mt-1 d-block">
              Questions in {summaryStats.totalAttempts} test attempts
            </small>
          </div>
        </div>
      </div>

      {/* Main Section: Chart & High Scores */}
      {filteredHistory.length === 0 ? (
        /* Empty State */
        <div className="card bg-dark border-secondary p-5 text-center my-4 shadow-sm">
          <div className="d-flex justify-content-center mb-3">
            <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
              <Trophy size={42} />
            </div>
          </div>
          <h5 className="text-light fw-bold">No Quiz History Recorded Yet</h5>
          <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '480px' }}>
            Complete mock quizzes or full exam simulations to record your scores.
            The leaderboard will visualize your progress trends, domain strengths, and personal bests.
          </p>
          <div className="d-flex justify-content-center gap-2">
            {onTakeQuiz && (
              <button
                className="btn btn-sm btn-info text-dark fw-bold px-3 py-2 d-flex align-items-center gap-1.5"
                onClick={onTakeQuiz}
              >
                <PlayCircle size={16} />
                <span>Start a Mock Quiz Now</span>
              </button>
            )}
            {onAddSampleHistory && (
              <button
                className="btn btn-sm btn-outline-warning px-3 py-2 d-flex align-items-center gap-1.5"
                onClick={onAddSampleHistory}
              >
                <Sparkles size={16} />
                <span>Load Sample Test Records</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Recharts Bar Chart Card */}
          <div className="col-12 col-xl-7">
            <div className="card bg-dark border-secondary p-4 h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="text-light fw-bold mb-0 d-flex align-items-center gap-2">
                    <TrendingUp size={16} className="text-info" />
                    <span>
                      {chartMetric === 'timeline'
                        ? 'Score Progression Over Time'
                        : 'Personal Best Scores by CEH Domain'}
                    </span>
                  </h6>
                  <small className="text-secondary">
                    {chartMetric === 'timeline'
                      ? 'Chronological attempt history with 75% cut-score threshold'
                      : 'Highest percentage achieved per CEH subject area'}
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 small">
                    ≥75% Passing
                  </span>
                  <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 small">
                    50-74%
                  </span>
                </div>
              </div>

              {/* Chart Render */}
              <div style={{ width: '100%', height: '340px' }} className="pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {chartMetric === 'timeline' ? (
                    <BarChart
                      data={timelineData}
                      margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                      <XAxis
                        dataKey="attemptLabel"
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        angle={-25}
                        textAnchor="end"
                        height={45}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        unit="%"
                      />
                      <Tooltip content={<CustomTimelineTooltip />} />
                      <ReferenceLine
                        y={75}
                        stroke="#238636"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Cut-Score 75%',
                          fill: '#3fb950',
                          position: 'insideTopRight',
                          fontSize: 11
                        }}
                      />
                      <Bar dataKey="score" name="Score %" radius={[4, 4, 0, 0]}>
                        {timelineData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={
                              entry.score >= 75
                                ? '#238636' // Green passing
                                : entry.score >= 50
                                ? '#d29922' // Amber warning
                                : '#da3633' // Red fail
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <BarChart
                      data={domainBestData}
                      margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                      <XAxis
                        dataKey="domainLabel"
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        angle={-25}
                        textAnchor="end"
                        height={45}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        unit="%"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#161b22',
                          borderColor: '#30363d',
                          color: '#f0f6fc',
                          borderRadius: '8px'
                        }}
                      />
                      <ReferenceLine
                        y={75}
                        stroke="#238636"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Pass 75%',
                          fill: '#3fb950',
                          position: 'insideTopRight',
                          fontSize: 11
                        }}
                      />
                      <Bar dataKey="bestScore" name="High Score %" radius={[4, 4, 0, 0]}>
                        {domainBestData.map((entry, idx) => (
                          <Cell
                            key={`domain-cell-${idx}`}
                            fill={
                              entry.bestScore >= 75
                                ? '#238636'
                                : entry.bestScore >= 50
                                ? '#d29922'
                                : '#da3633'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary border-opacity-40 text-secondary small">
                <span style={{ fontSize: '0.75rem' }}>
                  Hover over any bar to view date, score ratio, and duration details.
                </span>
                <span className="font-monospace text-info" style={{ fontSize: '0.75rem' }}>
                  {filteredHistory.length} attempts plotted
                </span>
              </div>
            </div>
          </div>

          {/* High Scores Podium & Table */}
          <div className="col-12 col-xl-5">
            <div className="card bg-dark border-secondary p-4 h-100 shadow-sm d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="text-light fw-bold mb-0 d-flex align-items-center gap-2">
                    <Award size={16} className="text-warning" />
                    <span>Personal High Score Rankings</span>
                  </h6>
                  <small className="text-secondary">
                    Best scores ranked by score percentage
                  </small>
                </div>
                <span className="badge bg-secondary bg-opacity-30 text-light font-monospace small">
                  Top {Math.min(rankedRecords.length, 10)}
                </span>
              </div>

              {/* Podium for Top 3 */}
              {rankedRecords.length > 0 && (
                <div className="row g-2 mb-3">
                  {rankedRecords.slice(0, 3).map((record, index) => {
                    const medals = [
                      { rank: '1st', color: 'text-warning', bg: 'bg-warning', border: 'border-warning' },
                      { rank: '2nd', color: 'text-secondary', bg: 'bg-secondary', border: 'border-secondary' },
                      { rank: '3rd', color: 'text-warning text-opacity-75', bg: 'bg-warning bg-opacity-50', border: 'border-warning' }
                    ];
                    const medal = medals[index];

                    return (
                      <div key={record.id} className="col-4">
                        <div
                          className={`p-2.5 rounded text-center border ${medal.border} border-opacity-30 bg-black bg-opacity-40 h-100 d-flex flex-column justify-content-between`}
                        >
                          <div>
                            <span className={`fw-bold small ${medal.color}`}>
                              #{index + 1} {medal.rank}
                            </span>
                            <h4 className="text-light fw-bold my-1">{record.score}%</h4>
                            <span className="badge bg-secondary bg-opacity-30 text-secondary font-monospace" style={{ fontSize: '0.65rem' }}>
                              {record.correctAnswers}/{record.totalQuestions}
                            </span>
                          </div>
                          <div className="small text-secondary mt-1 text-truncate" style={{ fontSize: '0.68rem' }}>
                            {record.domainCode || 'All Modules'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rankings Table */}
              <div className="table-responsive flex-grow-1 overflow-y-auto" style={{ maxHeight: '280px' }}>
                <table className="table table-dark table-hover table-sm align-middle mb-0">
                  <thead className="table-secondary bg-opacity-10 text-secondary small">
                    <tr>
                      <th style={{ width: '45px' }}>Rank</th>
                      <th>Score</th>
                      <th>Correct</th>
                      <th>Domain</th>
                      <th>Mode</th>
                      <th className="text-end">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedRecords.map((record, index) => {
                      const dateObj = new Date(record.date);
                      const dateStr = !isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })
                        : '—';

                      return (
                        <tr key={record.id}>
                          <td>
                            {index === 0 ? (
                              <span className="badge bg-warning text-dark fw-bold">1</span>
                            ) : index === 1 ? (
                              <span className="badge bg-secondary text-light fw-bold">2</span>
                            ) : index === 2 ? (
                              <span className="badge bg-warning bg-opacity-50 text-light fw-bold">3</span>
                            ) : (
                              <span className="text-secondary small">#{index + 1}</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                record.score >= 75
                                  ? 'bg-success'
                                  : record.score >= 50
                                  ? 'bg-warning text-dark'
                                  : 'bg-danger'
                              } fw-bold`}
                            >
                              {record.score}%
                            </span>
                          </td>
                          <td className="font-monospace small text-light">
                            {record.correctAnswers}/{record.totalQuestions}
                          </td>
                          <td className="small text-info text-truncate" style={{ maxWidth: '100px' }}>
                            {record.domainCode || 'All'}
                          </td>
                          <td className="small text-secondary">
                            {record.mode === 'exam' ? 'Exam' : 'Practice'}
                          </td>
                          <td className="small text-secondary text-end font-monospace">
                            {dateStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
