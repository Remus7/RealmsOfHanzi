import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ChevronLeft, ChevronRight, ImagePlus, LayoutGrid, RotateCcw, Search, X } from 'lucide-react';
import { backImage, cards, elements, hskLevels, rarities, type Card, type Element, type HskLevel, type Rarity } from './cards';
import './styles.css';

type View = 'dashboard' | 'collection' | 'add';
type FilterState = {
  rarity: Rarity | 'All';
  hsk: HskLevel | 'All';
  element: Element | 'All';
};

const initialFilters: FilterState = { rarity: 'All', hsk: 'All', element: 'All' };
const maxTilt = 28;
const clampTilt = (value: number) => Math.max(-maxTilt, Math.min(maxTilt, value));

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [returnView, setReturnView] = useState<View>('dashboard');

  const openAdd = () => {
    setReturnView(view);
    setView('add');
  };

  if (view === 'add') return <NotImplemented onBack={() => setView(returnView)} />;
  if (view === 'collection') return <Collection onBack={() => setView('dashboard')} />;
  return <Dashboard onAdd={openAdd} onCollection={() => setView('collection')} />;
}

function Dashboard({ onAdd, onCollection }: { onAdd: () => void; onCollection: () => void }) {
  return (
    <main className="shell dashboard">
      <section className="dashboardHeader">
        <p className="eyebrow">Mandarin collection</p>
        <h1>Hanzi Realms</h1>
      </section>
      <nav className="dashboardActions" aria-label="Main actions">
        <button className="choiceButton" onClick={onAdd}>
          <ImagePlus />
          <span>Add New Cards</span>
        </button>
        <button className="choiceButton primary" onClick={onCollection}>
          <LayoutGrid />
          <span>View Collection</span>
        </button>
      </nav>
    </main>
  );
}

function NotImplemented({ onBack }: { onBack: () => void }) {
  return (
    <main className="shell centerPage">
      <section className="emptyState">
        <h1>Not implemented yet</h1>
        <button className="iconTextButton" onClick={onBack}>
          <ArrowLeft />
          <span>Return</span>
        </button>
      </section>
    </main>
  );
}

function Collection({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visibleCards = useMemo(() => {
    const search = query.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesSearch = !search || `${card.hanzi} ${card.pinyin}`.toLowerCase().includes(search);
      return (
        matchesSearch &&
        (filters.rarity === 'All' || card.rarity === filters.rarity) &&
        (filters.hsk === 'All' || card.hsk === filters.hsk) &&
        (filters.element === 'All' || card.element === filters.element)
      );
    });
  }, [filters, query]);

  return (
    <main className="shell collectionPage">
      <header className="topBar">
        <button className="iconButton" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">Current collection</p>
          <h1>{visibleCards.length} cards</h1>
        </div>
      </header>

      <section className="toolbar">
        <label className="searchBox">
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hanzi or pinyin" />
        </label>
        <Filter label="Rarity" value={filters.rarity} values={rarities} onChange={(rarity) => setFilters({ ...filters, rarity })} />
        <Filter label="HSK" value={filters.hsk} values={hskLevels} onChange={(hsk) => setFilters({ ...filters, hsk })} />
        <Filter label="Element" value={filters.element} values={elements} onChange={(element) => setFilters({ ...filters, element })} />
        <button className="iconButton" onClick={() => setFilters(initialFilters)} aria-label="Reset filters">
          <RotateCcw />
        </button>
      </section>

      <section className="cardGrid" aria-label="Card collection">
        {visibleCards.map((card, index) => (
          <button key={card.id} className="cardTile" onClick={() => setActiveIndex(index)}>
            <img src={card.image} alt={`${card.hanzi} card`} />
            <span className="cardName">{card.hanzi}</span>
          </button>
        ))}
      </section>

      {activeIndex !== null && visibleCards[activeIndex] && (
        <ExpandedCard
          cards={visibleCards}
          index={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </main>
  );
}

function Filter<T extends string>({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: T | 'All';
  values: readonly T[];
  onChange: (value: T | 'All') => void;
}) {
  return (
    <label className="selectField">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T | 'All')}>
        <option value="All">All</option>
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

function ExpandedCard({
  cards,
  index,
  onChange,
  onClose,
}: {
  cards: Card[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const card = cards[index];

  const move = useCallback((direction: -1 | 1) => {
    onChange((index + direction + cards.length) % cards.length);
    setFlipped(false);
  }, [cards.length, index, onChange]);

  const setCardTransform = useCallback((x: number, y: number) => {
    const node = cardRef.current;
    if (!node) return;
    node.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move, onClose]);

  useEffect(() => {
    setCardTransform(0, 0);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [card.id, setCardTransform]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = cardRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      setCardTransform(clampTilt(y * -32), clampTilt(x * 32));
    });
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" onPointerMove={handlePointerMove} onPointerLeave={() => setCardTransform(0, 0)}>
      <button className="iconButton closeButton" onClick={onClose} aria-label="Close card">
        <X />
      </button>
      <button className="navButton left" onClick={() => move(-1)} aria-label="Previous card">
        <ChevronLeft />
      </button>
      <button className="navButton right" onClick={() => move(1)} aria-label="Next card">
        <ChevronRight />
      </button>

      <div
        ref={cardRef}
        className="expandedCard"
        onClick={() => setFlipped(!flipped)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') setFlipped(!flipped);
        }}
        role="button"
        tabIndex={0}
        aria-label={`Flip ${card.hanzi} card`}
      >
        <span className={`cardFlip ${flipped ? 'flipped' : ''}`}>
          <img className="cardFace front" src={card.image} alt={`${card.hanzi} card front`} />
          <img className="cardFace back" src={backImage} alt="Card back" />
        </span>
      </div>

      <aside className="overlayMeta">
        <h2>{card.hanzi}</h2>
        <p>{card.pinyin}</p>
      </aside>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
