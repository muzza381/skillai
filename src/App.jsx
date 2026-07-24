import React, { useState } from 'react';
import Header from './components/Header';
import MockInterview from './components/MockInterview';
import SkillTree from './components/SkillTree';
import CodeSandbox from './components/CodeSandbox';
import Flashcards from './components/Flashcards';
import Analytics from './components/Analytics';
import PromptSettingsModal from './components/PromptSettingsModal';
import { getApiKey } from './services/aiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('interview');
  const [selectedRole, setSelectedRole] = useState('fullstack');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('prompts');
  const [hasApiKey, setHasApiKey] = useState(!!getApiKey());

  const handleOpenPrompts = () => {
    setModalMode('prompts');
    setIsModalOpen(true);
  };

  const handleOpenApiKey = () => {
    setModalMode('apikey');
    setIsModalOpen(true);
  };

  const handleStartDrill = (node) => {
    setActiveTab('interview');
  };

  return (
    <div className="app-container">
      {/* Top Header Navbar */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onOpenPrompts={handleOpenPrompts}
        onOpenApiKey={handleOpenApiKey}
        hasApiKey={hasApiKey}
      />

      {/* Main Tab Body */}
      <main style={{ marginTop: '16px' }}>
        {activeTab === 'interview' && (
          <MockInterview 
            selectedRole={selectedRole}
          />
        )}

        {activeTab === 'skilltree' && (
          <SkillTree 
            selectedRole={selectedRole}
            onStartDrill={handleStartDrill}
          />
        )}

        {activeTab === 'codesandbox' && (
          <CodeSandbox />
        )}

        {activeTab === 'flashcards' && (
          <Flashcards 
            selectedRole={selectedRole}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics 
            selectedRole={selectedRole}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        marginTop: '60px', 
        paddingTop: '20px', 
        borderTop: '1px solid var(--border-color)', 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <p>PrepMaster AI — AI-Powered Technical & Behavioral Interview Suite</p>
        <p style={{ marginTop: '4px', fontSize: '0.78rem' }}>
          Driven by custom Google Gemini AI instructions • Built with React & Vite
        </p>
      </footer>

      {/* Prompt Customizer & API Key Modal */}
      <PromptSettingsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setHasApiKey(!!getApiKey());
        }}
        mode={modalMode}
      />
    </div>
  );
}
