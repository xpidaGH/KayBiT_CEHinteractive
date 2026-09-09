import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Star,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Terminal,
  Volume2,
  Layers,
  LayoutGrid,
  CreditCard,
  Trash2,
  Copy,
  Check,
  Filter,
  X,
  Tag
} from 'lucide-react';
import { FlashcardTerm } from '../types';
import { CEH_FLASHCARDS } from '../data/flashcardTerms';

const STARRED_STORAGE_KEY = 'kaybit_ceh_starred_terms_v1';
const MASTERED_STORAGE_KEY = 'kaybit_ceh_mastered_terms_v1';

export const Flashcards: React.FC = () => {
  // Starred terms in localStorage
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STARRED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Mastered terms in session/localStorage
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(MASTERED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Deck state
  const [deck, setDeck] = useState<FlashcardTerm[]>(CEH_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Grid view individual flip states
  const [flippedGridIds, setFlippedGridIds] = useState<Record<string, boolean>>({});

  // Display and Filter states
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const [onlyStarred, setOnlyStarred] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Sync starred terms to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STARRED_STORAGE_KEY, JSON.stringify(starredIds));
    } catch (e) {
      console.warn('Failed to save starred terms to localStorage:', e);
    }
  }, [starredIds]);

  // Sync mastered terms to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MASTERED_STORAGE_KEY, JSON.stringify(masteredIds));
    } catch (e) {
      console.warn('Failed to save mastered terms to localStorage:', e);
    }
  }, [masteredIds]);

  // Get distinct domains for filtering
  const distinctDomains = useMemo(() => {
    const map = new Map<string, string>();
    CEH_FLASHCARDS.forEach((card) => {
      if (!map.has(card.domainCode)) {
        map.set(card.domainCode, card.domainName);
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  // Get distinct categories for filtering
  const distinctCategories = useMemo(() => {
    const map = new Map<string, number>();
    CEH_FLASHCARDS.forEach((card) => {
      if (card.category) {
        map.set(card.category, (map.get(card.category) || 0) + 1);
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  // Filtered flashcards list
  const filteredCards = useMemo(() => {
    return deck.filter((card) => {
      if (onlyStarred && !starredIds.includes(card.id)) {
        return false;
      }
      if (selectedDomain !== 'ALL' && card.domainCode !== selectedDomain) {
        return false;
      }
      if (selectedCategory !== 'ALL' && card.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTerm = card.term.toLowerCase().includes(query);
        const matchesDef = card.definition.toLowerCase().includes(query);
        const matchesTip = card.examTip.toLowerCase().includes(query);
        const matchesCat = card.category.toLowerCase().includes(query);
        const matchesDom = card.domainName.toLowerCase().includes(query);
        const matchesCode = card.domainCode.toLowerCase().includes(query);
        const matchesExample = card.commandOrExample
          ? card.commandOrExample.toLowerCase().includes(query)
          : false;
        if (
          !matchesTerm &&
          !matchesDef &&
          !matchesTip &&
          !matchesCat &&
          !matchesDom &&
          !matchesCode &&
          !matchesExample
        ) {
          return false;
        }
      }
      return true;
    });
  }, [deck, onlyStarred, starredIds, selectedDomain, selectedCategory, searchQuery]);

  // Keep currentIndex in bounds when filtered cards change
  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length, onlyStarred, selectedDomain, selectedCategory, searchQuery]);

  const currentCard: FlashcardTerm | undefined = filteredCards[currentIndex];

  // Star toggle
  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Mastered toggle
  const handleToggleMastered = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Deck Navigation
  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % (filteredCards.length || 1));
    }, 150);
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % (filteredCards.length || 1));
    }, 150);
  }, [filteredCards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Shuffle deck
  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  // Keyboard navigation for study deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (viewMode !== 'deck' || filteredCards.length === 0) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 's' || e.key === 'S') {
        if (currentCard) {
          e.preventDefault();
          handleToggleStar(currentCard.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, filteredCards.length, handleFlip, handleNext, handlePrev, currentCard]);

  // Audio pronunciation
  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy code snippet
  const handleCopySnippet = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Clear all stars
  const handleClearAllStars = () => {
    if (window.confirm('Are you sure you want to un-star all difficult terms?')) {
      setStarredIds([]);
    }
  };

  const isCurrentStarred = currentCard ? starredIds.includes(currentCard.id) : false;
  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  return (
    <div className="container-fluid px-3 py-4 max-w-7xl mx-auto">
      {/* Top Banner & Control Bar */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Header Title */}
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-info bg-opacity-10 text-info border border-info border-opacity-25">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="mb-0 text-light fw-bold">CEH Domain Term Flashcards</h4>
                <span className="badge bg-info bg-opacity-20 text-info border border-info border-opacity-30">
                  {CEH_FLASHCARDS.length} Exam Terms
                </span>
              </div>
              <small className="text-secondary">
                Master high-yield CEH v13 definitions, attack vectors, and exam tips with interactive 3D flip study
              </small>
            </div>
          </div>

          {/* Quick Stats & Star Count */}
          <div className="d-flex align-items-center gap-2">
            <button
              id="btn-filter-starred"
              className={`btn btn-sm d-flex align-items-center gap-1.5 ${
                onlyStarred ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning'
              }`}
              onClick={() => setOnlyStarred(!onlyStarred)}
              title="Show only starred terms"
            >
              <Star size={15} className={starredIds.length > 0 ? 'fill-current' : ''} />
              <span>Starred Terms ({starredIds.length})</span>
            </button>

            {/* View Mode Toggle */}
            <div className="btn-group btn-group-sm border border-secondary rounded">
              <button
                id="btn-mode-deck"
                className={`btn ${viewMode === 'deck' ? 'btn-info text-dark fw-semibold' : 'btn-dark text-secondary'}`}
                onClick={() => setViewMode('deck')}
                title="Single Card Study Mode"
              >
                <CreditCard size={14} className="me-1" />
                <span>Deck View</span>
              </button>
              <button
                id="btn-mode-grid"
                className={`btn ${viewMode === 'grid' ? 'btn-info text-dark fw-semibold' : 'btn-dark text-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Grid Catalog Mode"
              >
                <LayoutGrid size={14} className="me-1" />
                <span>Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="row g-2 mt-2 pt-2 border-top border-secondary align-items-center">
          {/* Search Box */}
          <div className="col-12 col-md-5 col-lg-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-info">
                <Search size={14} />
              </span>
              <input
                id="input-search-flashcards"
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Search term, definition, CVE, tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  id="btn-clear-search-flashcards"
                  className="btn btn-outline-secondary border-secondary text-secondary"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <div className="col-12 col-sm-6 col-md-3 col-lg-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary" title="Category Filter">
                <Filter size={13} />
              </span>
              <select
                id="select-flashcard-category"
                className="form-select form-select-sm bg-dark text-light border-secondary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="ALL">All Categories ({CEH_FLASHCARDS.length})</option>
                {distinctCategories.map(([category, count]) => (
                  <option key={category} value={category}>
                    {category} ({count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Filter Dropdown */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <select
              id="select-flashcard-domain"
              className="form-select form-select-sm bg-dark text-light border-secondary"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              aria-label="Filter by CEH domain"
            >
              <option value="ALL">All CEH Modules & Domains ({CEH_FLASHCARDS.length})</option>
              {distinctDomains.map(([code, name]) => {
                const count = CEH_FLASHCARDS.filter((c) => c.domainCode === code).length;
                return (
                  <option key={code} value={code}>
                    {code}: {name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quick Deck Actions */}
          <div className="col-12 col-lg-2 d-flex justify-content-md-end gap-1.5 align-items-center">
            <button
              id="btn-shuffle-deck"
              className="btn btn-sm btn-outline-secondary text-light d-flex align-items-center gap-1"
              onClick={handleShuffle}
              title="Shuffle the order of flashcards"
            >
              <Shuffle size={14} />
              <span>Shuffle</span>
            </button>

            {starredIds.length > 0 && onlyStarred && (
              <button
                id="btn-clear-starred"
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                onClick={handleClearAllStars}
                title="Clear all starred terms"
              >
                <Trash2 size={13} />
                <span>Reset Stars</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Pills & Active Filter Tags */}
        <div className="mt-2.5 pt-2 border-top border-secondary border-opacity-40">
          <div className="d-flex flex-wrap align-items-center gap-1.5">
            <span className="text-secondary small d-flex align-items-center gap-1 me-1" style={{ fontSize: '0.72rem' }}>
              <Tag size={12} className="text-info" />
              <span>Quick Categories:</span>
            </span>

            <button
              className={`btn btn-xs py-0.5 px-2 rounded-pill ${
                selectedCategory === 'ALL'
                  ? 'btn-info text-dark fw-bold'
                  : 'btn-outline-secondary text-secondary hover:text-light'
              }`}
              style={{ fontSize: '0.72rem' }}
              onClick={() => setSelectedCategory('ALL')}
            >
              All
            </button>

            {distinctCategories.slice(0, 8).map(([cat, count]) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  className={`btn btn-xs py-0.5 px-2 rounded-pill ${
                    isSelected
                      ? 'btn-info text-dark fw-bold'
                      : 'btn-outline-secondary text-secondary hover:text-light'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat)}
                >
                  {cat} <span className="opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Active Filters Summary Bar if filters are applied */}
          {(searchQuery || selectedCategory !== 'ALL' || selectedDomain !== 'ALL' || onlyStarred) && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2 pt-2 border-top border-secondary border-opacity-30">
              <div className="d-flex flex-wrap align-items-center gap-1.5 small">
                <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                  Filtering ({filteredCards.length} result{filteredCards.length === 1 ? '' : 's'}):
                </span>

                {searchQuery && (
                  <span className="badge bg-secondary text-info d-flex align-items-center gap-1 font-monospace">
                    Search: "{searchQuery}"
                    <button
                      className="btn btn-link p-0 text-info text-decoration-none"
                      onClick={() => setSearchQuery('')}
                      title="Remove search filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedCategory !== 'ALL' && (
                  <span className="badge bg-secondary text-info d-flex align-items-center gap-1">
                    Category: {selectedCategory}
                    <button
                      className="btn btn-link p-0 text-info text-decoration-none"
                      onClick={() => setSelectedCategory('ALL')}
                      title="Remove category filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedDomain !== 'ALL' && (
                  <span className="badge bg-secondary text-info d-flex align-items-center gap-1 font-monospace">
                    Domain: {selectedDomain}
                    <button
                      className="btn btn-link p-0 text-info text-decoration-none"
                      onClick={() => setSelectedDomain('ALL')}
                      title="Remove domain filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                {onlyStarred && (
                  <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                    ★ Starred Only
                    <button
                      className="btn btn-link p-0 text-dark text-decoration-none"
                      onClick={() => setOnlyStarred(false)}
                      title="Show all cards"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              <button
                id="btn-clear-all-flashcard-filters"
                className="btn btn-link p-0 text-secondary hover:text-light text-decoration-none small"
                style={{ fontSize: '0.75rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedDomain('ALL');
                  setOnlyStarred(false);
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Flashcard Body */}
      {filteredCards.length === 0 ? (
        /* Empty State */
        <div className="card bg-dark border-secondary p-5 text-center my-4 shadow-sm">
          <div className="d-flex justify-content-center mb-3">
            <div className="p-3 rounded-circle bg-secondary bg-opacity-25 text-warning">
              <Star size={36} />
            </div>
          </div>
          <h5 className="text-light fw-bold">
            {onlyStarred ? 'No Starred Flashcards Found' : 'No Matching Terms Found'}
          </h5>
          <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '460px' }}>
            {onlyStarred
              ? 'You haven’t starred any difficult terms yet. Star terms by clicking the star icon on any flashcard to build your personalized review deck.'
              : selectedCategory !== 'ALL'
              ? `No terms found in category "${selectedCategory}" matching your criteria.`
              : selectedDomain !== 'ALL'
              ? `No terms found in domain "${selectedDomain}" matching your criteria.`
              : 'No flashcard matches your current search or filter criteria.'}
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {onlyStarred && (
              <button className="btn btn-sm btn-info text-dark fw-semibold" onClick={() => setOnlyStarred(false)}>
                Show All Flashcards
              </button>
            )}
            {selectedCategory !== 'ALL' && (
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => setSelectedCategory('ALL')}
              >
                Reset Category Filter
              </button>
            )}
            {selectedDomain !== 'ALL' && (
              <button
                className="btn btn-sm btn-outline-secondary text-light"
                onClick={() => setSelectedDomain('ALL')}
              >
                Reset Domain Filter
              </button>
            )}
            {searchQuery && (
              <button
                className="btn btn-sm btn-outline-secondary text-light"
                onClick={() => setSearchQuery('')}
              >
                Clear Search Filter
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-secondary text-light"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedDomain('ALL');
                setOnlyStarred(false);
              }}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : viewMode === 'deck' && currentCard ? (
        /* 1. SINGLE CARD STUDY DECK MODE */
        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          {/* Deck Counter & Progress Header */}
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary bg-opacity-40 text-info font-monospace small">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
              <span className="text-secondary small" style={{ fontSize: '0.78rem' }}>
                Press <kbd className="bg-black text-info border border-secondary px-1 py-0.5 rounded">Space</kbd> to flip • <kbd className="bg-black text-info border border-secondary px-1 py-0.5 rounded">←</kbd> <kbd className="bg-black text-info border border-secondary px-1 py-0.5 rounded">→</kbd> to navigate • <kbd className="bg-black text-info border border-secondary px-1 py-0.5 rounded">S</kbd> to star
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              {isCurrentMastered && (
                <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 small d-flex align-items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Mastered</span>
                </span>
              )}
              {isCurrentStarred && (
                <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 small d-flex align-items-center gap-1">
                  <Star size={12} className="fill-current" />
                  <span>Starred for Review</span>
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress mb-3 bg-secondary bg-opacity-25" style={{ height: '5px' }}>
            <div
              className="progress-bar bg-info"
              role="progressbar"
              style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
              aria-valuenow={((currentIndex + 1) / filteredCards.length) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* 3D Flip Card Container */}
          <div
            className="perspective-container cursor-pointer mb-4"
            style={{ minHeight: '430px', cursor: 'pointer' }}
            onClick={handleFlip}
          >
            <div className={`flip-card-inner ${isFlipped ? 'flip-card-flipped' : ''}`}>
              {/* === CARD FRONT === */}
              <div className="flip-card-face flip-card-front card bg-dark border-secondary shadow-lg d-flex flex-column justify-content-between p-4 p-md-5">
                {/* Front Top Bar */}
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="badge bg-info text-dark fw-bold font-monospace">
                      {currentCard.domainCode}
                    </span>
                    <span className="badge bg-secondary bg-opacity-40 text-light border border-secondary">
                      {currentCard.category}
                    </span>
                    <span className="text-secondary small d-none d-sm-inline">
                      {currentCard.domainName}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-sm btn-outline-secondary p-1.5 text-secondary hover:text-light"
                      onClick={(e) => handleSpeak(currentCard.term, e)}
                      title="Pronounce term"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      id="btn-deck-star"
                      className={`btn btn-sm p-1.5 ${
                        isCurrentStarred
                          ? 'btn-warning text-dark'
                          : 'btn-outline-secondary text-secondary hover:text-warning'
                      }`}
                      onClick={(e) => handleToggleStar(currentCard.id, e)}
                      title={isCurrentStarred ? 'Starred as difficult (click to un-star)' : 'Star as difficult for review'}
                    >
                      <Star size={16} className={isCurrentStarred ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>

                {/* Front Center: Big Term */}
                <div className="text-center my-auto py-4">
                  <span className="text-secondary small text-uppercase tracking-wider fw-semibold d-block mb-2">
                    CEH v13 Examination Term
                  </span>
                  <h2 className="text-light fw-extrabold mb-3 tracking-tight" style={{ fontSize: '2.2rem' }}>
                    {currentCard.term}
                  </h2>
                  <div className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-black bg-opacity-50 border border-secondary text-info small">
                    <BookOpen size={13} />
                    <span>Domain: {currentCard.domainName}</span>
                  </div>
                </div>

                {/* Front Footer: Hint & Flip prompt */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-50 text-secondary small">
                  <span className="d-flex align-items-center gap-1 text-info text-opacity-75">
                    <RotateCw size={13} />
                    <span>Click anywhere on card or press <strong>Space</strong> to reveal definition</span>
                  </span>
                  <span className="badge bg-secondary bg-opacity-25 text-secondary">
                    Flip Front
                  </span>
                </div>
              </div>

              {/* === CARD BACK === */}
              <div className="flip-card-face flip-card-back card bg-dark border-info border-opacity-50 shadow-lg d-flex flex-column justify-content-between p-4 p-md-5 overflow-y-auto">
                {/* Back Top Bar */}
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="badge bg-info text-dark fw-bold font-monospace">
                      {currentCard.domainCode}
                    </span>
                    <span className="text-light fw-bold">{currentCard.term}</span>
                  </div>

                  <div className="d-flex align-items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-sm btn-outline-secondary p-1.5 text-secondary hover:text-light"
                      onClick={(e) => handleSpeak(`${currentCard.term}. ${currentCard.definition}`, e)}
                      title="Read definition aloud"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      className={`btn btn-sm p-1.5 ${
                        isCurrentStarred
                          ? 'btn-warning text-dark'
                          : 'btn-outline-secondary text-secondary hover:text-warning'
                      }`}
                      onClick={(e) => handleToggleStar(currentCard.id, e)}
                      title={isCurrentStarred ? 'Starred as difficult' : 'Star as difficult'}
                    >
                      <Star size={16} className={isCurrentStarred ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>

                {/* Back Body: Definition, Exam Tip, and Code/Command */}
                <div className="flex-grow-1 mb-3">
                  {/* Definition */}
                  <div className="mb-3">
                    <h6 className="text-secondary text-uppercase fw-semibold small mb-1" style={{ fontSize: '0.72rem' }}>
                      Official Concept & Definition
                    </h6>
                    <p className="text-light fs-6 mb-0 lh-base" style={{ color: '#e6edf3' }}>
                      {currentCard.definition}
                    </p>
                  </div>

                  {/* Exam Tip Callout */}
                  <div className="p-3 rounded bg-warning bg-opacity-10 border border-warning border-opacity-30 mb-3">
                    <div className="d-flex align-items-center gap-1.5 text-warning fw-bold small mb-1">
                      <Lightbulb size={15} />
                      <span>CEH v13 Exam Tip & Trap Warning</span>
                    </div>
                    <p className="text-light small mb-0 lh-base" style={{ fontSize: '0.85rem' }}>
                      {currentCard.examTip}
                    </p>
                  </div>

                  {/* Command / Example snippet if available */}
                  {currentCard.commandOrExample && (
                    <div className="p-2.5 rounded bg-black border border-secondary font-monospace position-relative">
                      <div className="d-flex justify-content-between align-items-center text-secondary small mb-1 pb-1 border-bottom border-secondary border-opacity-30">
                        <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                          <Terminal size={12} className="text-info" />
                          <span>Syntax / Verification Command / Example</span>
                        </span>
                        <button
                          className="btn btn-link p-0 text-secondary hover:text-info text-decoration-none"
                          onClick={(e) => handleCopySnippet(currentCard.id, currentCard.commandOrExample!, e)}
                          title="Copy snippet to clipboard"
                        >
                          {copiedSnippetId === currentCard.id ? (
                            <span className="text-success small d-flex align-items-center gap-0.5">
                              <Check size={11} /> Copied!
                            </span>
                          ) : (
                            <span className="text-secondary small d-flex align-items-center gap-0.5">
                              <Copy size={11} /> Copy
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="text-info small text-break" style={{ fontSize: '0.82rem' }}>
                        <code>{currentCard.commandOrExample}</code>
                      </div>
                    </div>
                  )}
                </div>

                {/* Back Footer: Self-Assessment & Flip Prompt */}
                <div
                  className="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-50 gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Self-Rating */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                      Self-Assess:
                    </span>
                    <button
                      className={`btn btn-xs py-1 px-2.5 btn-sm d-flex align-items-center gap-1 ${
                        isCurrentMastered ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={(e) => handleToggleMastered(currentCard.id, e)}
                    >
                      <CheckCircle2 size={13} />
                      <span>{isCurrentMastered ? 'Mastered!' : 'Know It Well'}</span>
                    </button>
                    <button
                      className={`btn btn-xs py-1 px-2.5 btn-sm d-flex align-items-center gap-1 ${
                        isCurrentStarred ? 'btn-warning text-dark' : 'btn-outline-warning'
                      }`}
                      onClick={(e) => handleToggleStar(currentCard.id, e)}
                    >
                      <Star size={13} className={isCurrentStarred ? 'fill-current' : ''} />
                      <span>{isCurrentStarred ? 'Starred' : 'Review Later'}</span>
                    </button>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                    onClick={handleFlip}
                  >
                    <RotateCw size={13} />
                    <span>Flip Front</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="d-flex justify-content-between align-items-center gap-2">
            <button
              id="btn-deck-prev"
              className="btn btn-outline-secondary text-light px-3 d-flex align-items-center gap-1.5"
              onClick={handlePrev}
            >
              <ChevronLeft size={18} />
              <span className="d-none d-sm-inline">Previous Card</span>
            </button>

            <button
              id="btn-deck-flip"
              className="btn btn-info text-dark fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
              onClick={handleFlip}
            >
              <RotateCw size={16} />
              <span>{isFlipped ? 'Flip to Term (Front)' : 'Flip to Definition (Back)'}</span>
            </button>

            <button
              id="btn-deck-next"
              className="btn btn-outline-secondary text-light px-3 d-flex align-items-center gap-1.5"
              onClick={handleNext}
            >
              <span className="d-none d-sm-inline">Next Card</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* 2. GRID BROWSER MODE */
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{filteredCards.length}</strong> terms. Click any card to flip between Term and Definition.
            </span>
            <span className="badge bg-secondary bg-opacity-30 text-info">
              {starredIds.length} Starred for Review
            </span>
          </div>

          <div className="row g-3">
            {filteredCards.map((card) => {
              const isCardFlipped = !!flippedGridIds[card.id];
              const isCardStarred = starredIds.includes(card.id);
              const isCardMastered = masteredIds.includes(card.id);

              return (
                <div key={card.id} className="col-12 col-md-6 col-xl-4">
                  <div
                    className="perspective-container"
                    style={{ height: '320px', cursor: 'pointer' }}
                    onClick={() =>
                      setFlippedGridIds((prev) => ({
                        ...prev,
                        [card.id]: !prev[card.id]
                      }))
                    }
                  >
                    <div className={`flip-card-inner ${isCardFlipped ? 'flip-card-flipped' : ''}`}>
                      {/* Grid Front */}
                      <div className="flip-card-face flip-card-front card bg-dark border-secondary p-3.5 d-flex flex-column justify-content-between shadow-sm hover:border-info transition-colors">
                        <div>
                          <div className="d-flex justify-content-between align-items-start gap-1 mb-2">
                            <div className="d-flex align-items-center gap-1.5">
                              <span className="badge bg-info text-dark font-monospace" style={{ fontSize: '0.68rem' }}>
                                {card.domainCode}
                              </span>
                              <span className="badge bg-secondary bg-opacity-30 text-light" style={{ fontSize: '0.68rem' }}>
                                {card.category}
                              </span>
                            </div>

                            <div className="d-flex align-items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                className={`btn btn-xs p-1 ${
                                  isCardStarred
                                    ? 'btn-warning text-dark'
                                    : 'btn-outline-secondary text-secondary hover:text-warning'
                                }`}
                                onClick={(e) => handleToggleStar(card.id, e)}
                                title="Star as difficult"
                              >
                                <Star size={13} className={isCardStarred ? 'fill-current' : ''} />
                              </button>
                            </div>
                          </div>

                          <h5 className="text-light fw-bold mt-2 mb-1">{card.term}</h5>
                          <span className="text-secondary small d-block" style={{ fontSize: '0.75rem' }}>
                            {card.domainName}
                          </span>
                        </div>

                        <div className="pt-2 border-top border-secondary border-opacity-40 d-flex justify-content-between align-items-center text-secondary small">
                          <span className="d-flex align-items-center gap-1 text-info text-opacity-75" style={{ fontSize: '0.72rem' }}>
                            <RotateCw size={11} />
                            <span>Click to reveal definition</span>
                          </span>
                          {isCardMastered && (
                            <span className="badge bg-success bg-opacity-25 text-success" style={{ fontSize: '0.68rem' }}>
                              Mastered
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Grid Back */}
                      <div className="flip-card-face flip-card-back card bg-dark border-info border-opacity-40 p-3.5 d-flex flex-column justify-content-between shadow-sm overflow-y-auto">
                        <div>
                          <div className="d-flex justify-content-between align-items-start gap-1 mb-2">
                            <span className="text-light fw-bold small">{card.term}</span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <button
                                className={`btn btn-xs p-1 ${
                                  isCardStarred
                                    ? 'btn-warning text-dark'
                                    : 'btn-outline-secondary text-secondary hover:text-warning'
                                }`}
                                onClick={(e) => handleToggleStar(card.id, e)}
                                title="Star as difficult"
                              >
                                <Star size={13} className={isCardStarred ? 'fill-current' : ''} />
                              </button>
                            </div>
                          </div>

                          <p className="text-light small mb-2 lh-sm" style={{ fontSize: '0.8rem', color: '#c9d1d9' }}>
                            {card.definition}
                          </p>

                          <div className="p-2 rounded bg-warning bg-opacity-10 border border-warning border-opacity-25 mb-2">
                            <span className="text-warning fw-semibold d-block" style={{ fontSize: '0.7rem' }}>
                              Exam Tip:
                            </span>
                            <span className="text-light" style={{ fontSize: '0.74rem' }}>
                              {card.examTip}
                            </span>
                          </div>
                        </div>

                        <div
                          className="pt-2 border-top border-secondary border-opacity-40 d-flex justify-content-between align-items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className={`btn btn-xs px-2 py-0.5 ${
                              isCardMastered ? 'btn-success' : 'btn-outline-success'
                            }`}
                            style={{ fontSize: '0.72rem' }}
                            onClick={(e) => handleToggleMastered(card.id, e)}
                          >
                            {isCardMastered ? '✓ Mastered' : 'Mark Mastered'}
                          </button>

                          <button
                            className="btn btn-xs btn-outline-info px-2 py-0.5"
                            style={{ fontSize: '0.72rem' }}
                            onClick={() =>
                              setFlippedGridIds((prev) => ({
                                ...prev,
                                [card.id]: false
                              }))
                            }
                          >
                            Flip Front
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
