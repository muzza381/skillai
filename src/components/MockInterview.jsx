import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  RefreshCw, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  BrainCircuit,
  Volume2,
  ThumbsUp,
  HelpCircle
} from 'lucide-react';
import { evaluateAnswer } from '../services/aiService';

const QUESTION_BANK = {
  fullstack: [
    { id: 'fs1', title: 'State Management & Performance', question: 'How do you optimize state management and prevent unnecessary component re-renders in a large-scale React application?' },
    { id: 'fs2', title: 'API & Microservices Architecture', question: 'Explain how you would design a resilient REST & GraphQL API architecture to handle high concurrency with fallback caching.' },
    { id: 'fs3', title: 'Database Indexing & Queries', question: 'Describe a situation where a slow database query caused high latency. How did you diagnose and index the schema to resolve it?' }
  ],
  frontend: [
    { id: 'fe1', title: 'Web Vitals & Bundle Optimization', question: 'What techniques do you use to achieve a high Lighthouse score, minimize Largest Contentful Paint (LCP), and execute code-splitting?' },
    { id: 'fe2', title: 'CSS Grid & Responsive Layouts', question: 'How do you ensure accessibility (a11y) and responsive performance across complex interactive component libraries?' },
    { id: 'fe3', title: 'Virtual DOM & Fiber Architecture', question: 'Explain how React reconciliation works under the hood and how key props impact tree diffing.' }
  ],
  backend: [
    { id: 'be1', title: 'Distributed Caching Strategy', question: 'Design a distributed rate limiter and Redis caching layer to handle 100,000 requests per second with strict consistency.' },
    { id: 'be2', title: 'Event-Driven Microservices', question: 'How do you ensure idempotency and handle partial failure scenarios using Kafka or RabbitMQ message queues?' },
    { id: 'be3', title: 'SQL vs NoSQL Scalability', question: 'Compare PostgreSQL vs MongoDB for a financial transaction system. What isolation levels and transaction guarantees are required?' }
  ],
  datascience: [
    { id: 'ds1', title: 'Model Evaluation & Overfitting', question: 'How do you detect and mitigate data leakage and overfitting when training large transformer models or gradient boosted trees?' },
    { id: 'ds2', title: 'Vector Databases & RAG Architecture', question: 'Explain how Retrieval-Augmented Generation (RAG) works, including chunking strategies, vector embeddings, and cosine similarity reranking.' },
    { id: 'ds3', title: 'Feature Engineering & Pipeline', question: 'Walk me through a machine learning pipeline you built end-to-end. How did you monitor data drift in production?' }
  ],
  behavioral: [
    { id: 'bh1', title: 'Resolving Technical Disagreements', question: 'Tell me about a time you strongly disagreed with a tech lead or product manager regarding an architectural decision. How did you handle it?' },
    { id: 'bh2', title: 'Handling Production Incidents', question: 'Describe a major production outage or bug you caused or inherited. How did you triage, resolve, and conduct the post-mortem?' },
    { id: 'bh3', title: 'Prioritization Under Tight Deadlines', question: 'How do you prioritize technical debt versus shipping new features when facing an urgent client deadline?' }
  ]
};

const PERSONAS = [
  { id: 'strict', name: 'Strict Tech Lead', avatar: '😤', desc: 'Demands deep technical precision and edge case handling.' },
  { id: 'mentor', name: 'Empathetic Senior Mentor', avatar: '🤝', desc: 'Focuses on growth, problem-solving thought process, and structure.' },
  { id: 'system', name: 'System Design Architect', avatar: '🏗️', desc: 'Evaluates scalability, trade-offs, and high-level system diagrams.' }
];

export default function MockInterview({ selectedRole, onSessionComplete }) {
  const roleQuestions = QUESTION_BANK[selectedRole] || QUESTION_BANK.fullstack;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState('mentor');
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const activeQuestion = roleQuestions[currentQuestionIndex] || roleQuestions[0];

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const startQuestion = () => {
    setTimerSeconds(0);
    setTimerActive(true);
    setAnswerText('');
    setEvaluation(null);
  };

  const handleNextQuestion = () => {
    const nextIdx = (currentQuestionIndex + 1) % roleQuestions.length;
    setCurrentQuestionIndex(nextIdx);
    startQuestion();
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      if (!timerActive) setTimerActive(true);
      // Simulate speech-to-text dictation sample if user doesn't type
      if (!answerText) {
        setAnswerText("In my previous project, I solved this by implementing an event-driven architecture using Redis caching. We identified that excessive database hits were causing high LCP. By introducing an in-memory TTL cache and optimistic UI updates, we reduced latency by 45% and improved team velocity.");
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    setTimerActive(false);
    setIsEvaluating(true);

    try {
      const evalResult = await evaluateAnswer({
        role: selectedRole,
        question: activeQuestion.question,
        answer: answerText,
        persona: selectedPersona
      });

      setEvaluation(evalResult);

      // Save history entry for analytics & skill tree unlocks
      const sessionData = {
        id: Date.now(),
        date: new Date().toISOString(),
        role: selectedRole,
        question: activeQuestion.title,
        score: evalResult.overallScore,
        metrics: evalResult.metrics,
        duration: timerSeconds
      };

      const existingLogs = JSON.parse(localStorage.getItem('prepmaster_session_logs') || '[]');
      existingLogs.unshift(sessionData);
      localStorage.setItem('prepmaster_session_logs', JSON.stringify(existingLogs));

      if (onSessionComplete) onSessionComplete(sessionData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: evaluation ? '1fr 1fr' : '1fr', gap: '24px' }}>
      
      {/* Question & Answer Box */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        
        {/* Top Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-primary">
              Question {currentQuestionIndex + 1} of {roleQuestions.length}
            </span>
            <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} />
              {formatTime(timerSeconds)}
            </span>
          </div>

          {/* Persona Selector */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`btn btn-sm ${selectedPersona === p.id ? 'btn-primary' : 'btn-secondary'}`}
                title={p.desc}
              >
                <span>{p.avatar}</span>
                <span style={{ fontSize: '0.8rem' }}>{p.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Title & Description */}
        <div style={{ background: 'rgba(99, 102, 241, 0.06)', borderLeft: '4px solid var(--primary)', padding: '20px', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {activeQuestion.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
            "{activeQuestion.question}"
          </p>
        </div>

        {/* Answer Input Box */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="form-label">Your Response (Type or Speak using Microphone):</label>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Tip: Use STAR method (Situation, Task, Action, Result)
            </span>
          </div>

          <textarea
            className="form-textarea"
            rows={7}
            placeholder="Type your response here or click the Microphone icon to record dictation..."
            value={answerText}
            onChange={(e) => {
              setAnswerText(e.target.value);
              if (!timerActive && e.target.value) setTimerActive(true);
            }}
          />
        </div>

        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`btn ${isRecording ? 'badge-warning pulse' : 'btn-secondary'}`}
              onClick={handleMicToggle}
              title="Toggle Microphone Speech Simulator"
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              {isRecording ? 'Listening...' : 'Voice Dictate'}
            </button>

            <button 
              className="btn btn-secondary"
              onClick={handleNextQuestion}
              title="Skip or Next Question"
            >
              <RefreshCw size={16} />
              Next Question
            </button>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={handleSubmitAnswer}
            disabled={!answerText.trim() || isEvaluating}
          >
            {isEvaluating ? (
              <>
                <BrainCircuit size={18} className="pulse" />
                AI Grading...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Submit & Grade Answer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-Time AI Evaluation Card */}
      {evaluation && (
        <div className="glass-panel-glow animate-fade-in" style={{ padding: '28px', background: 'rgba(18, 24, 38, 0.9)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={24} style={{ color: 'var(--primary-hover)' }} />
              <h2 style={{ fontSize: '1.3rem' }}>AI Performance Scorecard</h2>
            </div>
            <div style={{ 
              background: evaluation.overallScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${evaluation.overallScore >= 80 ? 'var(--success)' : 'var(--warning)'}`,
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '1.4rem',
              fontWeight: '800',
              color: evaluation.overallScore >= 80 ? 'var(--success)' : 'var(--warning)'
            }}>
              {evaluation.overallScore} / 100
            </div>
          </div>

          {/* 5 Evaluation Dimension Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
            {Object.entries(evaluation.metrics).map(([key, val]) => (
              <div key={key} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span style={{ fontWeight: '700', color: val >= 75 ? 'var(--success)' : 'var(--warning)' }}>
                    {val}%
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${val}%`, 
                    background: val >= 75 ? 'linear-gradient(90deg, var(--primary), var(--success))' : 'linear-gradient(90deg, var(--warning), var(--danger))',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Missed Concepts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <CheckCircle2 size={16} /> Key Strengths
              </h4>
              <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {evaluation.strengths.map((str, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{str}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: 'var(--warning)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <AlertTriangle size={16} /> Concepts to Improve
              </h4>
              <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {evaluation.missedConcepts.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Answer Recommendation */}
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--primary-hover)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={16} /> Recommended AI Model Answer (STAR)
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.5' }}>
              "{evaluation.improvedAnswer}"
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
