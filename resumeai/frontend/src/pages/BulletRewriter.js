import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const tones = [
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Formal corporate tone' },
  { id: 'impactful', label: 'Impactful', icon: '🚀', desc: 'Results-driven & bold' },
  { id: 'technical', label: 'Technical', icon: '⚙️', desc: 'For engineering roles' },
  { id: 'leadership', label: 'Leadership', icon: '👑', desc: 'Management & senior roles' },
];

const exampleBullets = [
  'Worked on the backend team to help fix bugs',
  'Did data analysis for the marketing department',
  'Helped with customer support tickets',
  'Was part of a team that launched a new product',
];

const BulletRewriter = () => {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('impactful');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [history, setHistory] = useState([]);

  const rewrite = async () => {
    if (!input.trim()) { toast.error('Please enter a bullet point first'); return; }
    setLoading(true);
    setResults([]);
    try {
      const res = await axios.post(`${API}/api/tools/rewrite-bullet`, {
        bullet: input.trim(),
        tone,
      });
      setResults(res.data.suggestions);
      setHistory(prev => [{ original: input, suggestions: res.data.suggestions, tone }, ...prev.slice(0, 4)]);
      toast.success('3 improved versions generated!');
    } catch (err) {
      toast.error('Rewrite failed. Check backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    toast.success('Copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const useExample = (example) => {
    setInput(example);
    setResults([]);
  };

  const strengthColors = ['var(--accent-primary)', '#3b82f6', '#a78bfa'];
  const strengthLabels = ['Best Match', 'Alternative', 'Creative'];

  return (
    <div style={{ minHeight: '100vh', padding: '100px 0 60px' }}>
      <div className="container" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-tag">✍️ AI Bullet Rewriter</div>
          <h1 className="section-title">Turn Weak Bullets Into<br /><span className="gradient-text">Powerful Achievements</span></h1>
          <p className="section-subtitle">Paste any weak bullet point — AI rewrites it into 3 powerful, ATS-optimized versions instantly.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>

          {/* Main Panel */}
          <div>
            {/* Tone Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 12, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 1, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Select Tone</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {tones.map(t => (
                  <button key={t.id} onClick={() => setTone(t.id)} style={{
                    padding: '12px 10px', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${tone === t.id ? 'var(--accent-primary)' : 'var(--border)'}`,
                    background: tone === t.id ? 'rgba(110,231,183,0.1)' : 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tone === t.id ? 'var(--accent-primary)' : 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>
                Your Weak Bullet Point
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="e.g. Worked on backend team to fix bugs and help with performance issues..."
                  style={{ minHeight: 100, resize: 'vertical', paddingRight: 100, lineHeight: 1.6 }}
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) rewrite(); }}
                />
                <span style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                  {input.length}/300
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>💡 Tip: Press Ctrl+Enter to rewrite</div>
            </div>

            {/* Rewrite Button */}
            <button
              className="btn-primary"
              onClick={rewrite}
              disabled={loading || !input.trim()}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16, marginBottom: 32 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid #0a0a0f', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  AI is rewriting...
                </span>
              ) : '✨ Rewrite with AI — Get 3 Versions'}
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 16, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  ✨ 3 Rewritten Versions
                </div>
                {results.map((suggestion, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)', border: `1px solid ${strengthColors[i]}30`,
                    borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 16,
                    position: 'relative', transition: 'all 0.3s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = strengthColors[i] + '60'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = strengthColors[i] + '30'}
                  >
                    {/* Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50, background: strengthColors[i] + '15', color: strengthColors[i], border: `1px solid ${strengthColors[i]}30`, fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>
                        {strengthLabels[i]}
                      </span>
                      <button
                        onClick={() => copyToClipboard(suggestion, i)}
                        style={{ padding: '6px 14px', borderRadius: 50, background: copied === i ? 'rgba(110,231,183,0.2)' : 'var(--bg-glass)', border: `1px solid ${copied === i ? 'var(--accent-primary)' : 'var(--border)'}`, cursor: 'pointer', fontSize: 12, color: copied === i ? 'var(--accent-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                      >
                        {copied === i ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>

                    {/* Text with bullet */}
                    <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, margin: 0, paddingLeft: 16, borderLeft: `3px solid ${strengthColors[i]}` }}>
                      {suggestion}
                    </p>

                    {/* Improvements tags */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                      {['Action verb', 'Quantified', 'ATS-optimized'].map(tag => (
                        <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 50, background: 'var(--bg-glass)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Original comparison */}
                <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: '#f87171', fontWeight: 600, marginBottom: 6, fontFamily: 'var(--font-display)' }}>❌ ORIGINAL (WEAK)</div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>{input}</p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && results.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✍️</div>
                <p style={{ fontSize: 14 }}>Your rewritten bullets will appear here</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Quick Examples */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>
                💡 TRY THESE EXAMPLES
              </h3>
              {exampleBullets.map((ex, i) => (
                <button key={i} onClick={() => useExample(ex)} style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  cursor: 'pointer', marginBottom: 8, fontSize: 12,
                  color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s', lineHeight: 1.5,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  "{ex.substring(0, 55)}..."
                </button>
              ))}
            </div>

            {/* Tips */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>
                🎯 WHAT MAKES A GREAT BULLET
              </h3>
              {[
                { icon: '⚡', tip: 'Start with a strong action verb (Led, Built, Drove)' },
                { icon: '📊', tip: 'Add numbers (increased by 40%, saved $50K)' },
                { icon: '🎯', tip: 'Show impact, not just tasks' },
                { icon: '🔑', tip: 'Include relevant keywords for ATS' },
              ].map(item => (
                <div key={item.tip} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.tip}</span>
                </div>
              ))}
            </div>

            {/* Recent History */}
            {history.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>
                  🕒 RECENT REWRITES
                </h3>
                {history.slice(0, 3).map((h, i) => (
                  <div key={i} onClick={() => { setInput(h.original); setResults(h.suggestions); setTone(h.tone); }}
                    style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', border: '1px solid var(--border)', cursor: 'pointer', marginBottom: 8, fontSize: 11, color: 'var(--text-muted)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {h.original.substring(0, 60)}...
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default BulletRewriter;
