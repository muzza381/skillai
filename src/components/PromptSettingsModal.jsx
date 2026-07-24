import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Sliders, 
  Save, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { 
  DEFAULT_PROMPTS, 
  getCustomPrompts, 
  saveCustomPrompts, 
  getApiKey, 
  saveApiKey 
} from '../services/aiService';

export default function PromptSettingsModal({ isOpen, onClose, mode = 'prompts' }) {
  const [activeTab, setActiveTab] = useState(mode);
  const [prompts, setPrompts] = useState(getCustomPrompts());
  const [apiKey, setApiKeyValue] = useState(getApiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePrompts = () => {
    saveCustomPrompts(prompts);
    saveApiKey(apiKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetPrompts = () => {
    setPrompts(DEFAULT_PROMPTS);
    saveCustomPrompts(DEFAULT_PROMPTS);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders style={{ color: 'var(--primary-hover)' }} />
            <h2 style={{ fontSize: '1.25rem' }}>AI Customizer & System Instructions</h2>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'prompts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('prompts')}
          >
            <Sliders size={14} /> Custom Prompts
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'apikey' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('apikey')}
          >
            <Key size={14} /> Gemini API Key
          </button>
        </div>

        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Inspect and customize the exact system prompts driving the AI interview coach, response evaluator, and code auditor.
            </p>

            <div className="form-group">
              <label className="form-label">Interviewer Persona Prompt Instructions:</label>
              <textarea 
                className="form-textarea"
                rows={4}
                style={{ fontFamily: 'var(--font-code)', fontSize: '0.82rem' }}
                value={prompts.interviewer}
                onChange={(e) => setPrompts({ ...prompts, interviewer: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Response Evaluator Rubric Prompt Instructions:</label>
              <textarea 
                className="form-textarea"
                rows={4}
                style={{ fontFamily: 'var(--font-code)', fontSize: '0.82rem' }}
                value={prompts.evaluator}
                onChange={(e) => setPrompts({ ...prompts, evaluator: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Code Reviewer Audit Prompt Instructions:</label>
              <textarea 
                className="form-textarea"
                rows={4}
                style={{ fontFamily: 'var(--font-code)', fontSize: '0.82rem' }}
                value={prompts.codeReviewer}
                onChange={(e) => setPrompts({ ...prompts, codeReviewer: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* API Key Tab */}
        {activeTab === 'apikey' && (
          <div>
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', border: '1px solid var(--border-color-glow)' }}>
              <h4 style={{ color: 'var(--primary-hover)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ShieldCheck size={16} /> Google Gemini API Integration
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Enter your Google Gemini API Key below to enable live cloud Gemini 1.5 Flash models. If left empty, PrepMaster AI automatically operates using its built-in smart heuristic engine!
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Google Gemini API Key:</label>
              <input 
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKeyValue(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          {activeTab === 'prompts' ? (
            <button className="btn btn-secondary btn-sm" onClick={handleResetPrompts}>
              <RotateCcw size={14} /> Reset Defaults
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSavePrompts}>
              {saveSuccess ? <Check size={16} /> : <Save size={16} />}
              {saveSuccess ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
