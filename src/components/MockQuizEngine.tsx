import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Award,
  PlusCircle,
  Download,
  Upload,
  Filter,
  Flag,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { QuizQuestion, QuizScoreRecord } from '../types';
import { playCorrectSound, playIncorrectSound, playExamCelebrationSound } from '../utils/audioFeedback';

interface MockQuizEngineProps {
  questions: QuizQuestion[];
  onAddQuestion: (newQuestion: QuizQuestion) => void;
  onImportQuestions: (imported: QuizQuestion[]) => void;
  activeDomainFilter: string;
  setActiveDomainFilter: (filter: string) => void;
  domainCodes: { code: string; title: string }[];
  quizHistory: QuizScoreRecord[];
  onSaveScoreRecord: (record: QuizScoreRecord) => void;
  onClearHistory: () => void;
}

export const MockQuizEngine: React.FC<MockQuizEngineProps> = ({
  questions = [],
  onAddQuestion,
  onImportQuestions,
  activeDomainFilter = 'all',
  setActiveDomainFilter,
  domainCodes = [],
  quizHistory = [],
  onSaveScoreRecord,
  onClearHistory
}) => {
  // Mode: 'practice' vs 'exam'
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Timer for exam mode
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Custom question form modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestionDomain, setNewQuestionDomain] = useState('MOD-03');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newCve, setNewCve] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Subtle Web Audio Feedback state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kaybit_ceh_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('kaybit_ceh_sound_enabled', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save sound preference:', e);
      }
      if (next) {
        playCorrectSound(0.8);
      }
      return next;
    });
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (activeDomainFilter === 'all') return true;
    return q.domainCode === activeDomainFilter;
  });

  // Reset indices on filter change
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setExamSubmitted(false);
  }, [activeDomainFilter, mode]);

  // Timer logic for Exam Mode
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (mode === 'exam' && !examSubmitted && timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, examSubmitted, timerRunning]);

  const startExam = () => {
    setMode('exam');
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setExamSubmitted(false);
    setSecondsElapsed(0);
    setTimerRunning(true);
    setCurrentIndex(0);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (examSubmitted) return;

    // Subtle audio feedback in Practice Mode
    if (mode === 'practice' && currentQ) {
      const isCorrect = optionIndex === currentQ.correctIndex;
      if (soundEnabled) {
        if (isCorrect) {
          playCorrectSound();
        } else {
          playIncorrectSound();
        }
      }
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  const currentQ = filteredQuestions[currentIndex];

  // Calculate score
  const calculateResults = () => {
    let correct = 0;
    filteredQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const total = filteredQuestions.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    setTimerRunning(false);
    const { correct, total, percent } = calculateResults();

    // Subtle audio feedback upon completing an Exam Simulation
    if (soundEnabled) {
      if (percent >= 75) {
        playExamCelebrationSound();
      } else {
        playIncorrectSound();
      }
    }

    const newRecord: QuizScoreRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: percent,
      totalQuestions: total,
      correctAnswers: correct,
      domainCode: activeDomainFilter,
      mode: 'exam'
    };
    onSaveScoreRecord(newRecord);
  };

  // Export question bank
  const handleExportQuestions = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'KayBiT_CEH_Question_Bank.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import question bank
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportQuestions(parsed);
          alert(`Successfully imported ${parsed.length} questions into your offline question bank!`);
        }
      } catch (err) {
        alert('Failed to parse question bank JSON. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  // Handle Add Custom Question
  const handleSaveCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newOptionA || !newOptionB) {
      alert('Please provide question text and at least options A and B.');
      return;
    }

    const domainObj = domainCodes.find((d) => d.code === newQuestionDomain);
    const domainNum = parseInt(newQuestionDomain.replace(/[^0-9]/g, ''), 10) || 1;
    const customQ: QuizQuestion = {
      id: `custom-${Date.now()}`,
      domainId: domainNum,
      domainCode: newQuestionDomain,
      domainName: domainObj ? domainObj.title : newQuestionDomain,
      question: newQuestionText,
      options: [newOptionA, newOptionB, newOptionC || 'None of the above', newOptionD || 'All of the above'],
      correctIndex: newCorrectIndex,
      explanation: newExplanation || 'Custom student practice question.',
      difficulty: newDifficulty,
      cveOrTool: newCve || 'Custom Student Scenario'
    };

    onAddQuestion(customQ);
    setShowQuestionModal(false);

    // Reset fields
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewExplanation('');
    setNewCve('');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container-fluid px-3 py-4">
      {/* Control Bar */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Practice vs Exam Mode Toggle */}
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${mode === 'practice' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => {
                  setMode('practice');
                  setTimerRunning(false);
                }}
              >
                Practice Mode (Instant Feedback)
              </button>
              <button
                type="button"
                className={`btn ${mode === 'exam' ? 'btn-danger text-white fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={startExam}
              >
                Exam Simulation Mode
              </button>
            </div>

            {mode === 'exam' && !examSubmitted && (
              <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-30 d-flex align-items-center gap-1 font-monospace py-1.5 px-2">
                <Clock size={13} />
                <span>Timer: {formatTimer(secondsElapsed)}</span>
              </span>
            )}
          </div>

          {/* Domain Filter Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <Filter size={15} className="text-secondary" />
            <select
              id="filter-quiz-domain"
              className="form-select form-select-sm bg-dark text-light border-secondary w-auto"
              value={activeDomainFilter}
              onChange={(e) => setActiveDomainFilter(e.target.value)}
            >
              <option value="all">All CEH v13 Modules ({questions.length} Questions)</option>
              {(domainCodes || []).map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code}: {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons: Custom Question, Export, Import */}
          <div className="d-flex align-items-center gap-2">
            <button
              id="btn-create-custom-question"
              className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
              onClick={() => setShowQuestionModal(true)}
            >
              <PlusCircle size={14} />
              <span>Create Question</span>
            </button>

            <button
              id="btn-export-question-bank"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={handleExportQuestions}
              title="Export offline question bank as JSON"
            >
              <Download size={14} />
              <span className="d-none d-sm-inline">Export JSON</span>
            </button>

            <label
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 mb-0 cursor-pointer"
              title="Import JSON question bank"
            >
              <Upload size={14} />
              <span className="d-none d-sm-inline">Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
            </label>

            <button
              id="btn-toggle-quiz-audio"
              className={`btn btn-sm d-flex align-items-center gap-1 ${
                soundEnabled
                  ? 'btn-outline-info text-info'
                  : 'btn-outline-secondary text-secondary'
              }`}
              onClick={toggleSound}
              title={soundEnabled ? 'Audio Feedback: ON (Click to Mute)' : 'Audio Feedback: MUTED (Click to Enable)'}
              aria-label={soundEnabled ? 'Mute audio feedback' : 'Enable audio feedback'}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="d-none d-sm-inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="card bg-dark border-secondary p-5 text-center shadow-sm">
          <AlertCircle size={36} className="text-warning mx-auto mb-3" />
          <h5 className="text-light">No questions found for the selected module filter.</h5>
          <p className="text-secondary small mb-4">
            You can select "All CEH v13 Modules" or create a customized question for this domain.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-info btn-sm" onClick={() => setActiveDomainFilter('all')}>
              View All Questions
            </button>
            <button className="btn btn-outline-info btn-sm" onClick={() => setShowQuestionModal(true)}>
              Add Custom Question
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Main Question Card */}
          <div className="col-12 col-lg-8">
            <div className="card bg-dark border-secondary shadow-sm">
              {/* Question Header */}
              <div className="card-header bg-dark border-secondary p-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-secondary bg-opacity-40 text-info border border-secondary font-monospace">
                    {currentQ.domainCode}
                  </span>
                  <span className="badge bg-dark border border-secondary text-secondary small">
                    {currentQ.difficulty}
                  </span>
                  {currentQ.cveOrTool && (
                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 small font-monospace">
                      {currentQ.cveOrTool}
                    </span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className={`btn btn-sm ${flaggedQuestions[currentIndex] ? 'btn-warning text-dark' : 'btn-outline-secondary text-secondary'} d-flex align-items-center gap-1`}
                    onClick={toggleFlag}
                    title="Flag for later review"
                  >
                    <Flag size={13} />
                    <span className="d-none d-sm-inline">
                      {flaggedQuestions[currentIndex] ? 'Flagged' : 'Flag'}
                    </span>
                  </button>
                  <span className="text-secondary small font-monospace">
                    {currentIndex + 1} / {filteredQuestions.length}
                  </span>
                </div>
              </div>

              {/* Question Body */}
              <div className="card-body p-4">
                <h5 className="card-title text-light fw-semibold lh-base mb-4">
                  {currentQ.question}
                </h5>

                {/* Options List */}
                <div className="d-grid gap-2 mb-4">
                  {(currentQ.options || []).map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentIndex] === optIdx;
                    const isCorrect = optIdx === currentQ.correctIndex;
                    const showFeedback = mode === 'practice' && isSelected;
                    const examRevealed = examSubmitted;

                    let btnClass = 'btn btn-outline-secondary text-start p-3 text-light';

                    if (mode === 'practice' && isSelected) {
                      btnClass = isCorrect
                        ? 'btn btn-success text-start p-3 text-white border-success'
                        : 'btn btn-danger text-start p-3 text-white border-danger';
                    } else if (examRevealed) {
                      if (isCorrect) {
                        btnClass = 'btn btn-success text-start p-3 text-white border-success';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'btn btn-danger text-start p-3 text-white border-danger';
                      }
                    } else if (isSelected) {
                      btnClass = 'btn btn-info text-start p-3 text-dark fw-semibold border-info';
                    }

                    return (
                      <button
                        key={optIdx}
                        className={btnClass}
                        onClick={() => handleSelectAnswer(optIdx)}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <span className="badge bg-black bg-opacity-40 text-secondary border border-secondary font-monospace">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="small flex-fill">{option}</span>
                          {mode === 'practice' && isSelected && isCorrect && (
                            <CheckCircle size={18} className="text-white" />
                          )}
                          {mode === 'practice' && isSelected && !isCorrect && (
                            <XCircle size={18} className="text-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Explanation in Practice Mode */}
                {(mode === 'practice' && selectedAnswers[currentIndex] !== undefined) || examSubmitted ? (
                  <div
                    className={`alert ${
                      selectedAnswers[currentIndex] === currentQ.correctIndex
                        ? 'alert-success bg-success bg-opacity-10 border-success text-light'
                        : 'alert-danger bg-danger bg-opacity-10 border-danger text-light'
                    } mb-0 p-3`}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1 fw-bold">
                      {selectedAnswers[currentIndex] === currentQ.correctIndex ? (
                        <>
                          <CheckCircle size={16} className="text-success" />
                          <span className="text-success">Correct Solution!</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-danger" />
                          <span className="text-danger">
                            Incorrect. Correct answer is option {String.fromCharCode(65 + currentQ.correctIndex)}.
                          </span>
                        </>
                      )}
                    </div>
                    <p className="small mb-0 text-secondary" style={{ color: '#e6edf3' }}>
                      {currentQ.explanation}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Question Footer Navigation */}
              <div className="card-footer bg-dark border-secondary p-3 d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {mode === 'exam' && !examSubmitted ? (
                  <button
                    className="btn btn-danger btn-sm px-3 fw-bold"
                    onClick={handleSubmitExam}
                  >
                    Submit Exam Assessment
                  </button>
                ) : null}

                <button
                  className="btn btn-info btn-sm d-flex align-items-center gap-1 text-dark fw-semibold"
                  disabled={currentIndex === filteredQuestions.length - 1}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                >
                  <span>Next Question</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Exam Results Card */}
            {examSubmitted && (
              <div className="card bg-dark border-success mt-4 p-4 shadow">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Award size={24} className="text-success" />
                    <h5 className="text-light mb-0 fw-bold">Exam Simulation Complete</h5>
                  </div>
                  <span
                    className={`badge ${
                      calculateResults().percent >= 70 ? 'bg-success' : 'bg-danger'
                    } fs-6 px-3 py-2`}
                  >
                    Score: {calculateResults().percent}% ({calculateResults().correct} / {calculateResults().total})
                  </span>
                </div>
                <p className="small text-secondary mb-3">
                  {calculateResults().percent >= 70
                    ? 'Congratulations! You achieved a passing score on this CEH v13 simulation track.'
                    : 'Your score is below the 70% threshold. Review the incorrect answers highlighted above in red.'}
                </p>
                <div className="d-flex gap-2">
                  <button className="btn btn-success btn-sm" onClick={startExam}>
                    Retake Exam
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setMode('practice')}>
                    Switch to Practice Mode
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Question Palette & Score History */}
          <div className="col-12 col-lg-4">
            {/* Question Quick Jump Palette */}
            <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
              <h6 className="text-light fw-bold mb-3 d-flex justify-content-between align-items-center">
                <span>Question Matrix</span>
                <span className="small text-secondary font-monospace">
                  {Object.keys(selectedAnswers).length} / {filteredQuestions.length} answered
                </span>
              </h6>

              <div className="d-flex flex-wrap gap-1.5 mb-3">
                {filteredQuestions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = currentIndex === idx;
                  const isFlagged = flaggedQuestions[idx];

                  let colorClass = 'bg-secondary bg-opacity-25 border-secondary text-secondary';
                  if (isAnswered) {
                    colorClass = 'bg-info bg-opacity-25 border-info text-info';
                  }
                  if (isFlagged) {
                    colorClass = 'bg-warning bg-opacity-25 border-warning text-warning';
                  }
                  if (isCurrent) {
                    colorClass = 'bg-info text-dark border-info fw-bold';
                  }

                  return (
                    <button
                      key={idx}
                      className={`btn btn-sm p-0 d-flex align-items-center justify-content-center border ${colorClass}`}
                      style={{ width: '32px', height: '32px', fontSize: '0.78rem' }}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="small text-secondary d-flex flex-wrap gap-3 pt-2 border-top border-secondary">
                <span className="d-flex align-items-center gap-1">
                  <span className="badge bg-info p-1" style={{ width: '8px', height: '8px' }} /> Current
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="badge bg-info bg-opacity-25 p-1" style={{ width: '8px', height: '8px' }} /> Answered
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="badge bg-warning p-1" style={{ width: '8px', height: '8px' }} /> Flagged
                </span>
              </div>
            </div>

            {/* Score History Ledger */}
            <div className="card bg-dark border-secondary p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-light fw-bold mb-0">Exam Score History</h6>
                {quizHistory.length > 0 && (
                  <button
                    className="btn btn-link text-danger p-0 small text-decoration-none d-flex align-items-center gap-1"
                    onClick={onClearHistory}
                    title="Clear exam history records"
                  >
                    <Trash2 size={13} />
                    <span style={{ fontSize: '0.75rem' }}>Clear</span>
                  </button>
                )}
              </div>

              {quizHistory.length === 0 ? (
                <p className="small text-secondary mb-0">
                  No exams recorded yet. Switch to Exam Mode and complete a test to track your trajectory over time.
                </p>
              ) : (
                <div className="list-group list-group-flush border border-secondary rounded">
                  {quizHistory.slice(-5).reverse().map((rec) => (
                    <div
                      key={rec.id}
                      className="list-group-item bg-dark border-secondary d-flex justify-content-between align-items-center py-2 px-3"
                    >
                      <div>
                        <span
                          className={`badge ${
                            rec.score >= 70 ? 'bg-success' : 'bg-danger'
                          } me-2 font-monospace`}
                        >
                          {rec.score}%
                        </span>
                        <span className="small text-light">
                          {rec.correctAnswers}/{rec.totalQuestions} ({rec.domainCode})
                        </span>
                      </div>
                      <span className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                        {new Date(rec.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Question Creator Modal */}
      {showQuestionModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1070 }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-light border border-secondary shadow-lg">
              <form onSubmit={handleSaveCustomQuestion}>
                <div className="modal-header border-secondary px-4 py-3">
                  <h5 className="modal-title fw-bold text-info d-flex align-items-center gap-2">
                    <PlusCircle size={18} />
                    Create Custom CEH Practice Scenario
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowQuestionModal(false)}
                  />
                </div>

                <div className="modal-body px-4 py-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary small">Target Domain Module</label>
                      <select
                        className="form-select form-select-sm bg-dark text-light border-secondary"
                        value={newQuestionDomain}
                        onChange={(e) => setNewQuestionDomain(e.target.value)}
                      >
                        {(domainCodes || []).map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.code}: {d.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label text-secondary small">Difficulty</label>
                      <select
                        className="form-select form-select-sm bg-dark text-light border-secondary"
                        value={newDifficulty}
                        onChange={(e) => setNewDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label text-secondary small">CVE / Tool Reference</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        placeholder="e.g., CVE-2024-3094 or Nmap"
                        value={newCve}
                        onChange={(e) => setNewCve(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-secondary small">Scenario Question Prompt</label>
                      <textarea
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        rows={3}
                        required
                        placeholder="Describe the ethical hacking scenario or attack vector..."
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-secondary small">Option A</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        required
                        value={newOptionA}
                        onChange={(e) => setNewOptionA(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-secondary small">Option B</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        required
                        value={newOptionB}
                        onChange={(e) => setNewOptionB(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-secondary small">Option C</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        value={newOptionC}
                        onChange={(e) => setNewOptionC(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-secondary small">Option D</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        value={newOptionD}
                        onChange={(e) => setNewOptionD(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-info small fw-bold">Correct Option Answer</label>
                      <select
                        className="form-select form-select-sm bg-dark text-info border-info"
                        value={newCorrectIndex}
                        onChange={(e) => setNewCorrectIndex(parseInt(e.target.value, 10))}
                      >
                        <option value={0}>Option A</option>
                        <option value={1}>Option B</option>
                        <option value={2}>Option C</option>
                        <option value={3}>Option D</option>
                      </select>
                    </div>

                    <div className="col-md-8">
                      <label className="form-label text-secondary small">Technical Explanation & Rationale</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        placeholder="Explain why this option is correct based on CEH concepts..."
                        value={newExplanation}
                        onChange={(e) => setNewExplanation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary px-4 py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowQuestionModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-info btn-sm text-dark fw-bold">
                    Save to LocalStorage
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
