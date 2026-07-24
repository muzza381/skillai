import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Award, 
  ChevronRight, 
  Zap, 
  Sparkles,
  BookOpen
} from 'lucide-react';

const SKILL_TREES = {
  fullstack: [
    { id: 'fs_core', label: 'Web Fundamentals & DOM', status: 'mastered', score: 95, level: 1, desc: 'HTML5 Semantic layout, CSS Box Model, Event Loops, closures, and ES6+ async/await.', drills: ['Explain JavaScript Event Loop', 'CSS Flexbox vs Grid trade-offs'] },
    { id: 'fs_react', label: 'React & State Architecture', status: 'in-progress', score: 78, level: 2, desc: 'Hooks, Virtual DOM diffing, Context API, Redux/Zustand, and SSR vs CSR.', drills: ['Custom Hook implementation', 'Preventing unwanted re-renders'] },
    { id: 'fs_api', label: 'Node & REST / GraphQL APIs', status: 'in-progress', score: 70, level: 2, desc: 'Express middleware, JWT authentication, rate limiting, and GraphQL resolvers.', drills: ['JWT Refresh Token flow', 'RESTful API error handling'] },
    { id: 'fs_db', label: 'Database Schema & Query Optimization', status: 'locked', score: 0, level: 3, desc: 'PostgreSQL indexing, B-Trees, MongoDB aggregations, and ORMs.', drills: ['Explain N+1 Query problem', 'Database transaction isolation levels'] },
    { id: 'fs_system', label: 'System Design & Distributed Caching', status: 'locked', score: 0, level: 4, desc: 'Redis caching, load balancers, CDN integration, and microservices.', drills: ['Design a URL shortener system', 'Distributed rate limiting'] }
  ],
  frontend: [
    { id: 'fe_html', label: 'HTML5 Accessibility & SEO', status: 'mastered', score: 98, level: 1, desc: 'ARIA attributes, semantic tags, meta tags, and keyboard navigation.', drills: ['Building accessible modal dialogs'] },
    { id: 'fe_css', label: 'Modern CSS & Design Systems', status: 'mastered', score: 90, level: 1, desc: 'Tailwind, CSS Modules, HSL design tokens, and fluid typography.', drills: ['Creating fluid dark mode design tokens'] },
    { id: 'fe_perf', label: 'Web Vitals & Performance', status: 'in-progress', score: 72, level: 2, desc: 'LCP, CLS, INP optimization, code splitting, lazy loading, and Webpack/Vite.', drills: ['Optimizing Largest Contentful Paint'] },
    { id: 'fe_arch', label: 'Frontend Architecture & Micro-Frontends', status: 'locked', score: 0, level: 3, desc: 'Module Federation, state synchronization, and component design patterns.', drills: ['Designing an enterprise UI library'] }
  ],
  backend: [
    { id: 'be_lang', label: 'Async Runtime & Memory Management', status: 'mastered', score: 88, level: 1, desc: 'Node.js event loop, Go goroutines, Python GIL, and memory leak triage.', drills: ['Triaging memory leaks in Node.js'] },
    { id: 'be_db', label: 'Relational & NoSQL Storage', status: 'in-progress', score: 80, level: 2, desc: 'ACID transactions, Sharding, Read Replicas, and Vector DBs.', drills: ['Designing PostgreSQL indexes for millions of rows'] },
    { id: 'be_micro', label: 'Message Queues & Event Streaming', status: 'in-progress', score: 65, level: 3, desc: 'Kafka, RabbitMQ, event sourcing, idempotency, and pub-sub.', drills: ['Building idempotent consumer pipelines'] },
    { id: 'be_dist', label: 'Distributed Systems & Consensus', status: 'locked', score: 0, level: 4, desc: 'Raft consensus, CAP theorem, eventual consistency, and gRPC.', drills: ['Explaining Paxos vs Raft consensus'] }
  ]
};

export default function SkillTree({ selectedRole, onStartDrill }) {
  const nodes = SKILL_TREES[selectedRole] || SKILL_TREES.fullstack;
  const [selectedNode, setSelectedNode] = useState(nodes[0]);

  const masteredCount = nodes.filter(n => n.status === 'mastered').length;
  const progressPercent = Math.round((masteredCount / nodes.length) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
      
      {/* Skill Map Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        
        {/* Top Header & Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitBranch style={{ color: 'var(--primary-hover)' }} />
              Competency Skill Tree
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Master foundational nodes to unlock advanced system topics
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
              {progressPercent}% Unlocked
            </span>
            <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '4px' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        {/* Skill Node Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', margin: '20px 0' }}>
          {nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const isMastered = node.status === 'mastered';
            const isInProgress = node.status === 'in-progress';
            const isLocked = node.status === 'locked';

            return (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Level indicator */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  background: isMastered ? 'rgba(16, 185, 129, 0.2)' : (isInProgress ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)'),
                  color: isMastered ? 'var(--success)' : (isInProgress ? 'var(--primary-hover)' : 'var(--text-muted)'),
                  border: `2px solid ${isMastered ? 'var(--success)' : (isInProgress ? 'var(--primary)' : 'var(--border-color)')}`
                }}>
                  L{node.level}
                </div>

                {/* Node Card */}
                <div 
                  onClick={() => setSelectedNode(node)}
                  className={`glass-panel ${isSelected ? 'glass-panel-glow' : ''}`}
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'translateX(6px)' : 'none',
                    borderLeft: `4px solid ${isMastered ? 'var(--success)' : (isInProgress ? 'var(--primary)' : 'var(--border-color)')}`
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {node.label}
                      {isMastered && <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />}
                      {isInProgress && <Zap size={16} style={{ color: 'var(--warning)' }} className="pulse" />}
                      {isLocked && <Lock size={15} style={{ color: 'var(--text-muted)' }} />}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {node.desc.substring(0, 75)}...
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    {isMastered ? (
                      <span className="badge badge-success">{node.score}% Score</span>
                    ) : isInProgress ? (
                      <span className="badge badge-primary">{node.score}% Active</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Locked</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Node Detail & Drill Inspector */}
      {selectedNode && (
        <div className="glass-panel-glow animate-fade-in" style={{ padding: '28px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BookOpen size={22} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>{selectedNode.label}</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
            {selectedNode.desc}
          </p>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Recommended Target Practice Drills:
            </h4>
            <ul style={{ listStyle: 'none' }}>
              {selectedNode.drills.map((drill, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                  {drill}
                </li>
              ))}
            </ul>
          </div>

          <button 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={selectedNode.status === 'locked'}
            onClick={() => onStartDrill && onStartDrill(selectedNode)}
          >
            <PlayCircle size={18} />
            {selectedNode.status === 'locked' ? 'Locked (Complete Prior Level)' : 'Launch Dedicated Drill'}
          </button>
        </div>
      )}

    </div>
  );
}
