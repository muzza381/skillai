import React, { useState } from 'react';
import { 
  Layers, 
  RotateCw, 
  Check, 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Brain
} from 'lucide-react';

const INITIAL_CARDS = {
  fullstack: [
    { id: 1, topic: 'System Design', front: 'What is the CAP Theorem and how does PACELC expand upon it?', back: 'CAP states a distributed system can only guarantee 2 of: Consistency, Availability, Partition Tolerance. PACELC adds: If there is a Partition (P), trade off Availability (A) or Consistency (C); Else (E), trade off Latency (L) or Consistency (C).' },
    { id: 2, topic: 'React Architecture', front: 'When should you use useMemo / useCallback vs React.memo?', back: 'useMemo caches calculated values; useCallback caches callback function references to avoid child re-renders. Only use them when computational cost or child re-render prevention outweighs hook overhead.' },
    { id: 3, topic: 'Backend Security', front: 'What is CORS and how does a Preflight Request (OPTIONS) work?', back: 'Cross-Origin Resource Sharing prevents unauthorized cross-domain calls. Browsers send an HTTP OPTIONS preflight request before non-simple calls (e.g. custom headers, PUT/DELETE) to verify server approval.' }
  ],
  frontend: [
    { id: 1, topic: 'DOM Performance', front: 'What causes Layout Thrashing and how do you prevent it?', back: 'Layout Thrashing happens when JS repeatedly reads DOM metrics (e.g. offsetHeight) after mutating styles, forcing synchronous reflows. Fix by batching reads first, then writes (using requestAnimationFrame).' },
    { id: 2, topic: 'CSS Engineering', front: 'Explain how BFC (Block Formatting Context) is triggered.', back: 'BFC isolates element layout. Triggered by float, absolute positioning, display: inline-block / flow-root / flex / grid, or overflow other than visible.' }
  ],
  backend: [
    { id: 1, topic: 'Database Concurrency', front: 'What is Phantom Read vs Non-Repeatable Read?', back: 'Non-repeatable read: Re-reading a row returns modified data. Phantom read: Re-executing a range query returns newly inserted rows. Prevented at REPEATABLE READ and SERIALIZABLE isolation levels.' },
    { id: 2, topic: 'Distributed Messaging', front: 'How does Kafka guarantee message ordering within a topic?', back: 'Kafka guarantees strict message ordering ONLY within a single Partition. Messages with the same Partition Key are routed to the same partition sequentially.' }
  ]
};

export default function Flashcards({ selectedRole }) {
  const defaultDeck = INITIAL_CARDS[selectedRole] || INITIAL_CARDS.fullstack;
  const [deck, setDeck] = useState(defaultDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeCard = deck[currentIndex] || deck[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const markMastered = (id) => {
    if (!masteredIds.includes(id)) {
      setMasteredIds([...masteredIds, id]);
    }
    handleNext();
  };

  const handleGenerateAiCard = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCard = {
        id: Date.now(),
        topic: 'AI Generated Challenge',
        front: `[AI Practice Challenge]: How would you mitigate a DDoS attack at both the DNS and Application layer for a high-traffic ${selectedRole} service?`,
        back: `DNS Layer: Cloudflare/AWS Route53 rate limiting, Anycast BGP routing, SYN flood protection. Application Layer: Web Application Firewall (WAF) rule sets, IP throttling via Redis sliding window, API gateway auth limits.`
      };
      setDeck([newCard, ...deck]);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers style={{ color: 'var(--primary-hover)' }} />
            Dynamic Scenario Flashcard Deck
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Flip cards to review system concepts and STAR techniques
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={handleGenerateAiCard}
          disabled={isGenerating}
        >
          <Sparkles size={15} />
          {isGenerating ? 'Generating Card...' : 'AI Generate Scenario Card'}
        </button>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`glass-panel ${isFlipped ? 'glass-panel-glow' : ''}`}
        style={{
          minHeight: '340px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.4s ease',
          transform: isFlipped ? 'scale(1.01)' : 'none',
          position: 'relative',
          background: isFlipped ? 'rgba(25, 30, 48, 0.95)' : 'rgba(18, 24, 38, 0.75)',
          borderTop: `4px solid ${isFlipped ? 'var(--accent-cyan)' : 'var(--primary)'}`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge badge-primary">{activeCard?.topic || 'Core Skill'}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RotateCw size={14} /> Click card to flip ({isFlipped ? 'Back' : 'Front'})
          </span>
        </div>

        {/* Card Content */}
        <div style={{ margin: '30px 0', textAlign: 'center' }}>
          {!isFlipped ? (
            <div>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Question / Scenario:</p>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                "{activeCard?.front}"
              </h3>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '8px' }}>AI Model Concept & Explanation:</p>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.6', textAlign: 'left' }}>
                {activeCard?.back}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Card {currentIndex + 1} of {deck.length}</span>
          {masteredIds.includes(activeCard?.id) && (
            <span style={{ color: 'var(--success)', fontWeight: '700' }}>✓ Mastered</span>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <button className="btn btn-secondary" onClick={handlePrev}>
          <ChevronLeft size={18} /> Previous Card
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
            onClick={handleNext}
          >
            <X size={16} /> Need Review
          </button>
          <button 
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, var(--success), #059669)' }}
            onClick={() => markMastered(activeCard?.id)}
          >
            <Check size={16} /> Mastered Card
          </button>
        </div>

        <button className="btn btn-secondary" onClick={handleNext}>
          Next Card <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}
