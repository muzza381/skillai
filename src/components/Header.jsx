import React from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  GitBranch, 
  Code2, 
  Layers, 
  BarChart3, 
  Settings, 
  Key, 
  Briefcase,
  Sliders
} from 'lucide-react';

export const ROLES = [
  { id: 'fullstack', title: 'Full-Stack Engineer', icon: '💻' },
  { id: 'frontend', title: 'Frontend Specialist', icon: '🎨' },
  { id: 'backend', title: 'Backend & Systems', icon: '⚙️' },
  { id: 'datascience', title: 'Data Science & AI', icon: '📊' },
  { id: 'behavioral', title: 'Behavioral & HR', icon: '🤝' }
];

export default function Header({ 
  activeTab, 
  setActiveTab, 
  selectedRole, 
  setSelectedRole, 
  onOpenPrompts, 
  onOpenApiKey,
  hasApiKey 
}) {
  return (
    <header className="header glass-panel">
      <div className="header-brand">
        <div className="header-logo">
          ⚡
        </div>
        <div>
          <h1 className="header-title gradient-text">PrepMaster AI</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intelligent Interview Suite</p>
        </div>
      </div>

      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          <MessageSquare size={16} />
          Mock Interview
        </button>

        <button 
          className={`nav-tab ${activeTab === 'skilltree' ? 'active' : ''}`}
          onClick={() => setActiveTab('skilltree')}
        >
          <GitBranch size={16} />
          Skill Tree
        </button>

        <button 
          className={`nav-tab ${activeTab === 'codesandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('codesandbox')}
        >
          <Code2 size={16} />
          Code Sandbox
        </button>

        <button 
          className={`nav-tab ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          <Layers size={16} />
          Flashcards
        </button>

        <button 
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} />
          Analytics
        </button>
      </nav>

      <div className="header-actions">
        {/* Role Selector */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Briefcase size={16} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="form-select"
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', background: 'rgba(255,255,255,0.06)' }}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {ROLES.map(role => (
              <option key={role.id} value={role.id} style={{ background: '#121826', color: '#fff' }}>
                {role.icon} {role.title}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Prompt Instructions Button */}
        <button 
          className="btn btn-secondary btn-sm"
          title="Inspect & Customize AI System Prompts"
          onClick={onOpenPrompts}
        >
          <Sliders size={15} />
          <span style={{ fontSize: '0.8rem' }}>AI Prompts</span>
        </button>

        {/* API Key Modal Button */}
        <button 
          className={`btn btn-sm ${hasApiKey ? 'badge-success' : 'btn-secondary'}`}
          title={hasApiKey ? 'Gemini API Key Active' : 'Set Custom Gemini API Key'}
          onClick={onOpenApiKey}
          style={{ padding: '6px 12px' }}
        >
          <Key size={15} />
          <span style={{ fontSize: '0.8rem' }}>{hasApiKey ? 'AI Key Active' : 'Set Key'}</span>
        </button>
      </div>
    </header>
  );
}
