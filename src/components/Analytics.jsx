import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Download, 
  Calendar, 
  Target, 
  Sparkles,
  FileText
} from 'lucide-react';

export default function Analytics({ selectedRole }) {
  const [sessionLogs, setSessionLogs] = useState([]);

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('prepmaster_session_logs') || '[]');
    if (savedLogs.length === 0) {
      // Sample initial session data if empty
      const sampleLogs = [
        { id: 1, date: '2026-07-24', role: selectedRole, question: 'State Management & Performance', score: 88, duration: 210 },
        { id: 2, date: '2026-07-23', role: selectedRole, question: 'Distributed Caching Strategy', score: 76, duration: 180 },
        { id: 3, date: '2026-07-22', role: selectedRole, question: 'Resolving Technical Disagreements', score: 92, duration: 240 }
      ];
      setSessionLogs(sampleLogs);
    } else {
      setSessionLogs(savedLogs);
    }
  }, [selectedRole]);

  const totalSessions = sessionLogs.length;
  const avgScore = totalSessions > 0 ? Math.round(sessionLogs.reduce((acc, curr) => acc + curr.score, 0) / totalSessions) : 0;
  const totalMinutes = Math.round(sessionLogs.reduce((acc, curr) => acc + (curr.duration || 180), 0) / 60);

  const handleExportCertificate = () => {
    const certWindow = window.open('', '_blank');
    certWindow.document.write(`
      <html>
        <head>
          <title>PrepMaster AI - Readiness Certificate</title>
          <style>
            body { font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px; }
            .cert-card { border: 4px double #6366f1; padding: 40px; border-radius: 20px; background: #121826; display: inline-block; max-width: 650px; }
            h1 { color: #818cf8; font-size: 32px; margin-bottom: 10px; }
            .score { font-size: 48px; color: #10b981; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <h1>⚡ PrepMaster AI Certificate</h1>
            <p>Official Interview Readiness Assessment</p>
            <hr style="border-color: #334155; margin: 20px 0;"/>
            <p style="font-size: 18px;">Target Role: <strong>${selectedRole.toUpperCase()}</strong></p>
            <div class="score">${avgScore} / 100 Readiness Score</div>
            <p>Total Completed Sessions: ${totalSessions} | Practice Time: ${totalMinutes} Minutes</p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">Issued on ${new Date().toLocaleDateString()} via PrepMaster AI Suite</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      
      {/* Top Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={15} style={{ color: 'var(--primary)' }} /> READINESS SCORE
          </span>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-hover)', marginTop: '6px' }}>
            {avgScore} / 100
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>+8% from last week</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={15} style={{ color: 'var(--accent-cyan)' }} /> SESSIONS COMPLETED
          </span>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '6px' }}>
            {totalSessions}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mock interviews logged</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} style={{ color: 'var(--warning)' }} /> PRACTICE TIME
          </span>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)', marginTop: '6px' }}>
            {totalMinutes} mins
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active time in simulator</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} style={{ color: 'var(--success)' }} /> STRONGEST AREA
          </span>
          <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--success)', marginTop: '10px' }}>
            STAR Structure (94%)
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High impact delivery</span>
        </div>
      </div>

      {/* Main Analytics Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp style={{ color: 'var(--primary-hover)' }} />
              Interview History & Readiness Audit
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Historical transcript performance records and benchmark analytics
            </p>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleExportCertificate}
          >
            <Download size={16} />
            Export Readiness Certificate
          </button>
        </div>

        {/* Sessions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Track / Role</th>
                <th style={{ padding: '12px' }}>Question Topic</th>
                <th style={{ padding: '12px' }}>Duration</th>
                <th style={{ padding: '12px' }}>Overall Score</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessionLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{log.date ? log.date.substring(0,10) : '2026-07-24'}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{log.role || selectedRole}</td>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{log.question}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{Math.round(log.duration / 60 || 3)} mins</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      fontWeight: '800', 
                      color: log.score >= 80 ? 'var(--success)' : 'var(--warning)' 
                    }}>
                      {log.score}%
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-success">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
