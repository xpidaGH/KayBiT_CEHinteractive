import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Calendar,
  AlertTriangle,
  FileEdit,
  ExternalLink,
  Zap
} from 'lucide-react';
import { CEHDomain } from '../types';

interface DomainTrackerProps {
  domains: CEHDomain[];
  onUpdateDomain: (updated: CEHDomain) => void;
  onSelectForQuiz: (domainCode: string) => void;
  targetExamDate: string;
  onUpdateTargetExamDate: (date: string) => void;
}

export const DomainTracker: React.FC<DomainTrackerProps> = ({
  domains,
  onUpdateDomain,
  onSelectForQuiz,
  targetExamDate,
  onUpdateTargetExamDate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedCode, setExpandedCode] = useState<string | null>(domains[0]?.code || null);

  // Status counters
  const masteredCount = domains.filter((d) => d.status === 'mastered').length;
  const inProgressCount = domains.filter((d) => d.status === 'in_progress').length;
  const notStartedCount = domains.filter((d) => d.status === 'not_started').length;

  // Calculate weighted readiness
  const totalWeight = domains.reduce((acc, d) => acc + d.weight, 0);
  const earnedWeight = domains.reduce((acc, d) => {
    if (d.status === 'mastered') return acc + d.weight;
    if (d.status === 'in_progress') {
      const checklistDone = d.checklist.filter((s) => s.completed).length;
      const ratio = d.checklist.length > 0 ? checklistDone / d.checklist.length : 0.5;
      return acc + d.weight * (0.3 + 0.5 * ratio);
    }
    return acc;
  }, 0);
  const readinessPercent = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  // Countdown to exam
  const daysUntilExam = React.useMemo(() => {
    if (!targetExamDate) return null;
    const diff = new Date(targetExamDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [targetExamDate]);

  // Filtered domains
  const filteredDomains = domains.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.keyTools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.attackVectors.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return d.status === filterStatus;
  });

  const toggleSubtopic = (domain: CEHDomain, subtopicId: string) => {
    const updatedChecklist = domain.checklist.map((s) =>
      s.id === subtopicId ? { ...s, completed: !s.completed } : s
    );

    // Auto update status if all subtopics completed
    const allCompleted = updatedChecklist.every((s) => s.completed);
    let newStatus = domain.status;
    if (allCompleted) {
      newStatus = 'mastered';
    } else if (updatedChecklist.some((s) => s.completed) && domain.status === 'not_started') {
      newStatus = 'in_progress';
    }

    onUpdateDomain({
      ...domain,
      checklist: updatedChecklist,
      status: newStatus
    });
  };

  const handleStatusChange = (domain: CEHDomain, newStatus: CEHDomain['status']) => {
    onUpdateDomain({
      ...domain,
      status: newStatus
    });
  };

  const handleNotesChange = (domain: CEHDomain, notes: string) => {
    onUpdateDomain({
      ...domain,
      userNotes: notes
    });
  };

  return (
    <div className="container-fluid px-3 py-4">
      {/* Top Banner & Exam Gauge */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Readiness percentage */}
        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary p-3 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Weighted Exam Readiness
              </span>
              <span
                className={`badge ${
                  readinessPercent >= 75
                    ? 'bg-success'
                    : readinessPercent >= 45
                    ? 'bg-warning text-dark'
                    : 'bg-info text-dark'
                } fw-bold`}
              >
                {readinessPercent}%
              </span>
            </div>
            <div className="progress mb-2" style={{ height: '10px' }}>
              <div
                className={`progress-bar progress-bar-striped progress-bar-animated ${
                  readinessPercent >= 75
                    ? 'bg-success'
                    : readinessPercent >= 45
                    ? 'bg-warning'
                    : 'bg-info'
                }`}
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <p className="small text-secondary mb-0">
              EC-Council CEH v13 passing threshold is typically <strong>70% – 80%</strong> depending on the question cut score.
            </p>
          </div>
        </div>

        {/* Metric 2: Domain Completion Breakdown */}
        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary p-3 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Module Breakdown (20 Modules)
              </span>
              <Cpu size={16} className="text-info" />
            </div>
            <div className="d-flex gap-2 mb-2">
              <div className="flex-fill text-center p-2 rounded bg-black bg-opacity-40 border border-success border-opacity-30">
                <span className="d-block h5 text-success mb-0 fw-bold">{masteredCount}</span>
                <span className="small text-secondary" style={{ fontSize: '0.7rem' }}>Mastered</span>
              </div>
              <div className="flex-fill text-center p-2 rounded bg-black bg-opacity-40 border border-warning border-opacity-30">
                <span className="d-block h5 text-warning mb-0 fw-bold">{inProgressCount}</span>
                <span className="small text-secondary" style={{ fontSize: '0.7rem' }}>In Progress</span>
              </div>
              <div className="flex-fill text-center p-2 rounded bg-black bg-opacity-40 border border-secondary">
                <span className="d-block h5 text-secondary mb-0 fw-bold">{notStartedCount}</span>
                <span className="small text-secondary" style={{ fontSize: '0.7rem' }}>Not Started</span>
              </div>
            </div>
            <span className="small text-secondary">
              Total modules tracked: {domains.length} • Updated in real-time in LocalStorage
            </span>
          </div>
        </div>

        {/* Metric 3: Target Exam Date Countdown */}
        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary p-3 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Exam Date Countdown
              </span>
              <Calendar size={16} className="text-info" />
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <input
                type="date"
                id="input-exam-date"
                className="form-control form-control-sm bg-black text-light border-secondary"
                value={targetExamDate}
                onChange={(e) => onUpdateTargetExamDate(e.target.value)}
              />
              {daysUntilExam !== null && (
                <span
                  className={`badge text-nowrap ${
                    daysUntilExam > 30
                      ? 'bg-success-subtle text-success border border-success-subtle'
                      : daysUntilExam > 7
                      ? 'bg-warning-subtle text-warning border border-warning-subtle'
                      : 'bg-danger-subtle text-danger border border-danger-subtle'
                  } py-2`}
                >
                  {daysUntilExam > 0 ? `${daysUntilExam} days left` : 'Exam Due!'}
                </span>
              )}
            </div>
            <span className="small text-secondary">
              Set your target date to pace your study sessions across all 20 modules.
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
                <Search size={15} />
              </span>
              <input
                type="text"
                id="search-domains"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Search modules by name, tool (Nmap, Wireshark, Burp), port (443, 389), or vector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${filterStatus === 'all' ? 'btn-info text-dark fw-semibold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setFilterStatus('all')}
              >
                All ({domains.length})
              </button>
              <button
                type="button"
                className={`btn ${filterStatus === 'mastered' ? 'btn-success fw-semibold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setFilterStatus('mastered')}
              >
                Mastered ({masteredCount})
              </button>
              <button
                type="button"
                className={`btn ${filterStatus === 'in_progress' ? 'btn-warning text-dark fw-semibold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setFilterStatus('in_progress')}
              >
                In Progress ({inProgressCount})
              </button>
              <button
                type="button"
                className={`btn ${filterStatus === 'not_started' ? 'btn-secondary text-light' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setFilterStatus('not_started')}
              >
                Not Started ({notStartedCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Cards List */}
      <div className="row g-3">
        {filteredDomains.map((domain) => {
          const isExpanded = expandedCode === domain.code;
          const completedSubtopics = domain.checklist.filter((s) => s.completed).length;
          const totalSubtopics = domain.checklist.length;
          const percent = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

          return (
            <div key={domain.code} className="col-12">
              <div
                className={`card bg-dark border-secondary transition-all ${
                  isExpanded ? 'border-info shadow' : ''
                }`}
              >
                {/* Card Header / Summary Row */}
                <div
                  className="card-header bg-dark border-secondary p-3 d-flex flex-wrap align-items-center justify-content-between gap-3 cursor-pointer"
                  onClick={() => setExpandedCode(isExpanded ? null : domain.code)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-secondary bg-opacity-25 border border-secondary text-info font-monospace py-1.5 px-2">
                      {domain.code}
                    </span>
                    <div>
                      <h6 className="mb-0 text-light fw-bold">{domain.title}</h6>
                      <span className="small text-secondary">
                        Weight: {domain.weight}% of exam • {completedSubtopics}/{totalSubtopics} items completed ({percent}%)
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {/* Status Select */}
                    <select
                      className={`form-select form-select-sm w-auto fw-semibold ${
                        domain.status === 'mastered'
                          ? 'bg-success text-white border-success'
                          : domain.status === 'in_progress'
                          ? 'bg-warning text-dark border-warning'
                          : 'bg-secondary text-white border-secondary'
                      }`}
                      value={domain.status}
                      onChange={(e) => handleStatusChange(domain, e.target.value as CEHDomain['status'])}
                    >
                      <option value="not_started">⚪ Not Started</option>
                      <option value="in_progress">🟡 In Progress</option>
                      <option value="mastered">🟢 Mastered</option>
                    </select>

                    {/* Drill down quiz button */}
                    <button
                      className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                      onClick={() => onSelectForQuiz(domain.code)}
                      title="Practice mock questions for this specific module"
                    >
                      <Zap size={13} />
                      <span className="d-none d-sm-inline">Practice Quiz</span>
                    </button>

                    <button
                      className="btn btn-link text-secondary p-0"
                      onClick={() => setExpandedCode(isExpanded ? null : domain.code)}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Subtopic Progress Bar */}
                <div className="progress" style={{ height: '3px', borderRadius: 0 }}>
                  <div
                    className={`progress-bar ${
                      percent === 100
                        ? 'bg-success'
                        : percent > 50
                        ? 'bg-info'
                        : 'bg-warning'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Expanded Detailed Module View */}
                {isExpanded && (
                  <div className="card-body p-4 bg-black bg-opacity-25 border-top border-secondary">
                    <p className="text-light mb-4">{domain.description}</p>

                    <div className="row g-4">
                      {/* Column 1: Subtopic Interactive Checklist */}
                      <div className="col-12 col-lg-6">
                        <h6 className="text-info fw-bold mb-3 d-flex align-items-center gap-2">
                          <CheckCircle2 size={16} />
                          Learning Objectives & Checklist
                        </h6>
                        <div className="list-group list-group-flush border border-secondary rounded">
                          {domain.checklist.map((sub) => (
                            <label
                              key={sub.id}
                              className={`list-group-item list-group-item-action bg-dark text-light border-secondary d-flex align-items-center gap-3 py-2 cursor-pointer ${
                                sub.completed ? 'text-decoration-line-through text-secondary' : ''
                              }`}
                              style={{ cursor: 'pointer' }}
                            >
                              <input
                                className="form-check-input mt-0 border-secondary"
                                type="checkbox"
                                checked={sub.completed}
                                onChange={() => toggleSubtopic(domain, sub.id)}
                              />
                              <span className="small">{sub.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Attack Vectors, Common Ports & Countermeasures */}
                      <div className="col-12 col-lg-6">
                        {/* Key Tools */}
                        <div className="mb-3">
                          <span className="small text-secondary fw-semibold d-block mb-1 text-uppercase">
                            Key Examination Tools
                          </span>
                          <div className="d-flex flex-wrap gap-1">
                            {domain.keyTools.map((t, idx) => (
                              <span
                                key={idx}
                                className="badge bg-secondary bg-opacity-40 text-info border border-secondary small"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Attack Vectors */}
                        <div className="mb-3">
                          <span className="small text-secondary fw-semibold d-block mb-1 text-uppercase">
                            Core Attack Vectors
                          </span>
                          <div className="d-flex flex-wrap gap-1">
                            {domain.attackVectors.map((v, idx) => (
                              <span
                                key={idx}
                                className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-30 small"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Relevant Ports */}
                        {domain.relevantPorts && domain.relevantPorts.length > 0 && (
                          <div className="mb-3">
                            <span className="small text-secondary fw-semibold d-block mb-1 text-uppercase">
                              High-Frequency Exam Ports
                            </span>
                            <div className="d-flex flex-wrap gap-1">
                              {domain.relevantPorts.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 font-monospace small"
                                >
                                  Port {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Countermeasures */}
                        <div className="mb-3">
                          <span className="small text-secondary fw-semibold d-block mb-1 text-uppercase">
                            Defensive Mitigations
                          </span>
                          <ul className="small text-secondary ps-3 mb-0">
                            {domain.countermeasures.map((c, idx) => (
                              <li key={idx} className="mb-1">{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Column 3: In-Place Domain Study Notes */}
                      <div className="col-12">
                        <div className="p-3 rounded bg-black bg-opacity-40 border border-secondary">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="small text-info fw-semibold d-flex align-items-center gap-1">
                              <FileEdit size={14} />
                              Personal Tactical Notes for {domain.code}
                            </span>
                            <span className="badge bg-secondary bg-opacity-25 text-secondary small">
                              Auto-saved to LocalStorage
                            </span>
                          </div>
                          <textarea
                            className="form-control form-control-sm bg-dark text-light border-secondary font-monospace"
                            rows={3}
                            placeholder="Write your custom notes, cheatsheet commands, or exam mnemonics for this module..."
                            value={domain.userNotes || ''}
                            onChange={(e) => handleNotesChange(domain, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
