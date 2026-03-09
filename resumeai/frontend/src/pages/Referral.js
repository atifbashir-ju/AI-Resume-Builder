import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Referral = () => {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchReferralData(); }, []);

  const fetchReferralData = async () => {
    try {
      const res = await axios.get(`${API}/api/referral/my-referrals`);
      setReferralData(res.data);
    } catch (err) {
      // Mock data if API not ready
      setReferralData({
        referral_code: user?.name?.toUpperCase().replace(' ', '') + '2024' || 'MYCODE2024',
        referral_link: `${window.location.origin}/signup?ref=MYCODE2024`,
        total_referrals: 3,
        successful_referrals: 2,
        pending_rewards: 1,
        total_earned_days: 60,
        reward_per_referral: 30,
        referrals: [
          { name: 'Rahul M.', email: 'r***@gmail.com', status: 'completed', date: '2024-01-10', reward: '30 days Pro' },
          { name: 'Priya S.', email: 'p***@gmail.com', status: 'completed', date: '2024-01-05', reward: '30 days Pro' },
          { name: 'Ankit K.', email: 'a***@gmail.com', status: 'pending', date: '2024-01-14', reward: 'Pending' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralData.referral_link);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralData.referral_code);
    toast.success('Code copied!');
  };

  const sendInvite = async () => {
    if (!email.trim()) { toast.error('Enter an email address'); return; }
    setSending(true);
    try {
      await axios.post(`${API}/api/referral/send-invite`, { email });
      toast.success(`Invite sent to ${email}!`);
      setEmail('');
    } catch (err) {
      toast.error('Could not send invite right now');
    } finally {
      setSending(false);
    }
  };

  const shareOnWhatsApp = () => {
    const msg = encodeURIComponent(`Hey! I've been using ResumeAI to optimize my resume and it's amazing 🚀\n\nGet your FREE ATS score and AI-optimized resume here:\n${referralData.referral_link}\n\nUse my code: ${referralData.referral_code}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(referralData.referral_link);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    const msg = encodeURIComponent(`Just boosted my resume ATS score with @ResumeAI 🚀 Get yours analyzed for FREE!\n${referralData.referral_link}`);
    window.open(`https://twitter.com/intent/tweet?text=${msg}`, '_blank');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', fontSize: 18 }}>Loading...</div>
    </div>
  );

  const steps = [
    { num: '01', title: 'Share Your Link', desc: 'Share your unique referral link with friends, colleagues, or on social media.' },
    { num: '02', title: 'They Sign Up', desc: 'Your friend creates a free ResumeAI account using your referral link.' },
    { num: '03', title: 'They Analyze', desc: 'Your friend analyzes their first resume using the platform.' },
    { num: '04', title: 'Both Get Rewarded', desc: 'You get 30 days Pro free. They get 7 days Pro free. Win-win!' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '100px 0 60px' }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-tag" style={{ margin: '0 auto 20px' }}>🎁 Referral Program</div>
          <h1 className="section-title">Refer Friends,<br /><span className="gradient-text">Earn Free Pro Access</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            For every friend who joins and analyzes their resume, you both get rewarded with free Pro access.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Referrals', value: referralData.total_referrals, icon: '👥', color: 'var(--accent-primary)' },
            { label: 'Successful', value: referralData.successful_referrals, icon: '✅', color: '#3b82f6' },
            { label: 'Days Earned', value: referralData.total_earned_days, icon: '🏆', color: '#a78bfa' },
            { label: 'Pending Rewards', value: referralData.pending_rewards, icon: '⏳', color: 'var(--accent-orange)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, marginBottom: 40 }}>

          {/* Referral Link Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), #a78bfa)' }} />

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Your Referral Link</h2>

            {/* Link box */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <div style={{ flex: 1, padding: '12px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--accent-primary)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {referralData.referral_link}
              </div>
              <button onClick={copyLink} className={copied ? 'btn-primary' : 'btn-secondary'} style={{ padding: '12px 20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            {/* Referral code */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(110,231,183,0.05)', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your Code:</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: 2 }}>{referralData.referral_code}</span>
              <button onClick={copyCode} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}>Copy</button>
            </div>

            {/* Share buttons */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, letterSpacing: 0.5 }}>SHARE ON</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={shareOnWhatsApp} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', cursor: 'pointer', color: '#25d366', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}>
                  💬 WhatsApp
                </button>
                <button onClick={shareOnLinkedIn} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.2)', cursor: 'pointer', color: '#0a66c2', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,102,194,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,102,194,0.1)'}>
                  💼 LinkedIn
                </button>
                <button onClick={shareOnTwitter} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(29,161,242,0.1)', border: '1px solid rgba(29,161,242,0.2)', cursor: 'pointer', color: '#1da1f2', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,161,242,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(29,161,242,0.1)'}>
                  🐦 Twitter
                </button>
              </div>
            </div>

            {/* Email invite */}
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: 0.5 }}>OR INVITE BY EMAIL</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="email" placeholder="friend@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendInvite()} style={{ flex: 1 }} />
                <button onClick={sendInvite} disabled={sending} className="btn-primary" style={{ padding: '12px 20px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {sending ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>

          {/* Rewards card */}
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(110,231,183,0.1), rgba(59,130,246,0.1))', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🎁 Rewards</h3>
              <div style={{ marginBottom: 16, padding: '16px', background: 'rgba(110,231,183,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(110,231,183,0.15)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>YOU GET (per referral)</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent-primary)' }}>30 Days</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Pro Plan — Free</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>YOUR FRIEND GETS</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>7 Days</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Pro Plan — Free</div>
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
                No limit on referrals — refer 10 friends = 300 days Pro free! 🚀
              </div>
            </div>

            {/* Progress to next reward */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Next Milestone</span>
                <span style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 700 }}>{referralData.successful_referrals}/5</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 10 }}>
                <div className="progress-fill" style={{ width: `${(referralData.successful_referrals / 5) * 100}%` }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {5 - referralData.successful_referrals} more referrals → unlock <span style={{ color: '#a78bfa', fontWeight: 600 }}>3 Months Pro Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--accent-primary)' }}>{step.num}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral History */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Referral History</h2>
          {referralData.referrals.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
              <p style={{ color: 'var(--text-muted)' }}>No referrals yet. Share your link to get started!</p>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 140px', padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)' }}>
                {['Friend', 'Email', 'Status', 'Reward'].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, fontFamily: 'var(--font-display)' }}>{h}</div>
                ))}
              </div>
              {referralData.referrals.map((ref, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 140px', padding: '16px 24px', borderBottom: i < referralData.referrals.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ref.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{ref.email}</div>
                  <div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50,
                      background: ref.status === 'completed' ? 'rgba(110,231,183,0.1)' : 'rgba(251,191,36,0.1)',
                      color: ref.status === 'completed' ? 'var(--accent-primary)' : '#fbbf24',
                      border: `1px solid ${ref.status === 'completed' ? 'rgba(110,231,183,0.2)' : 'rgba(251,191,36,0.2)'}`,
                    }}>
                      {ref.status === 'completed' ? '✓ Done' : '⏳ Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: ref.status === 'completed' ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {ref.reward}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;
