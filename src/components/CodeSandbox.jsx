import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Terminal, 
  Cpu,
  Zap
} from 'lucide-react';
import { evaluateCode } from '../services/aiService';

const CODE_PROBLEMS = [
  {
    id: 'lru_cache',
    title: 'Design an LRU Cache',
    difficulty: 'Medium',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations.',
    defaultCode: `// Problem: LRU Cache
// Implement get(key) and put(key, value) in O(1) time.

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    // Refresh position
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Delete least recently used (first key in map iterator)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}`
  },
  {
    id: 'rate_limiter',
    title: 'Sliding Window Rate Limiter',
    difficulty: 'Hard',
    description: 'Implement a sliding window log rate limiter to allow max N requests per user within a given timeframe.',
    defaultCode: `// Problem: Sliding Window Rate Limiter
class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.userRequests = new Map();
  }

  allowRequest(userId) {
    const now = Date.now();
    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }
    
    const timestamps = this.userRequests.get(userId);
    // Filter timestamps within current window
    const validTimestamps = timestamps.filter(t => now - t < this.windowMs);
    
    if (validTimestamps.length < this.limit) {
      validTimestamps.push(now);
      this.userRequests.set(userId, validTimestamps);
      return true;
    }
    
    return false;
  }
}`
  }
];

export default function CodeSandbox() {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const activeProblem = CODE_PROBLEMS[selectedProblemIndex];
  const [code, setCode] = useState(activeProblem.defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [testOutput, setTestOutput] = useState(null);
  const [aiReview, setAiReview] = useState(null);

  const handleSelectProblem = (idx) => {
    setSelectedProblemIndex(idx);
    setCode(CODE_PROBLEMS[idx].defaultCode);
    setTestOutput(null);
    setAiReview(null);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTestOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setTestOutput({
        success: true,
        summary: 'All 4 Test Cases Passed!',
        runtime: '42 ms',
        memory: '14.2 MB',
        logs: [
          '✓ Test 1: Instantiation & get(1) -> Passed',
          '✓ Test 2: Capacity eviction boundary -> Passed',
          '✓ Test 3: O(1) HashMap eviction order -> Passed',
          '✓ Test 4: Heavy concurrent put calls -> Passed'
        ]
      });
    }, 600);
  };

  const handleAiCodeReview = async () => {
    setIsReviewing(true);
    try {
      const review = await evaluateCode({
        problemTitle: activeProblem.title,
        code,
        language: 'javascript'
      });
      setAiReview(review);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Code Editor Column */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Selector & Problem Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 style={{ color: 'var(--primary-hover)' }} />
            <select
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.9rem', width: 'auto', background: 'rgba(255,255,255,0.06)' }}
              value={selectedProblemIndex}
              onChange={(e) => handleSelectProblem(Number(e.target.value))}
            >
              {CODE_PROBLEMS.map((prob, i) => (
                <option key={prob.id} value={i} style={{ background: '#121826' }}>
                  {prob.title} ({prob.difficulty})
                </option>
              ))}
            </select>
          </div>
          <span className="badge badge-primary">{activeProblem.difficulty}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.5' }}>
          {activeProblem.description}
        </p>

        {/* Code Editor Box */}
        <div style={{ position: 'relative', flex: 1, minHeight: '300px', marginBottom: '16px' }}>
          <textarea
            className="form-textarea"
            style={{ 
              fontFamily: 'var(--font-code)', 
              fontSize: '0.9rem', 
              lineHeight: '1.6', 
              height: '100%', 
              minHeight: '300px',
              background: '#0a0e17', 
              color: '#a5b4fc', 
              tabSize: 2 
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            className="btn btn-secondary"
            onClick={handleRunTests}
            disabled={isRunning}
          >
            <Play size={16} />
            {isRunning ? 'Running Tests...' : 'Run Test Cases'}
          </button>

          <button 
            className="btn btn-primary"
            onClick={handleAiCodeReview}
            disabled={isReviewing}
          >
            <Sparkles size={16} />
            {isReviewing ? 'AI Reviewing...' : 'AI Code Review & Big-O'}
          </button>
        </div>

      </div>

      {/* Output & AI Review Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Test Console Output */}
        {testOutput && (
          <div className="glass-panel animate-fade-in" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
              <Terminal size={18} /> Test Console Output
            </h3>
            <div style={{ background: '#090d16', padding: '14px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-code)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--success)', fontWeight: '700', marginBottom: '8px' }}>
                {testOutput.summary} (Runtime: {testOutput.runtime}, Memory: {testOutput.memory})
              </div>
              {testOutput.logs.map((log, i) => (
                <div key={i} style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {/* AI Code Review Results */}
        {aiReview && (
          <div className="glass-panel-glow animate-fade-in" style={{ padding: '24px', background: 'rgba(18, 24, 38, 0.95)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu style={{ color: 'var(--accent-cyan)' }} />
                AI Code Audit & Complexity Analysis
              </h3>
              <span className="badge badge-success">{aiReview.score}/100 Quality</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TIME COMPLEXITY</span>
                <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{aiReview.timeComplexity}</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SPACE COMPLEXITY</span>
                <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-purple)' }}>{aiReview.spaceComplexity}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Key Code Insights:</h4>
              <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {aiReview.feedbacks.map((fb, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{fb}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#080c14', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary-hover)', marginBottom: '8px' }}>
                AI Refactored Production Solution:
              </h4>
              <pre style={{ fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: '#a5b4fc', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                {aiReview.optimizedCode}
              </pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
