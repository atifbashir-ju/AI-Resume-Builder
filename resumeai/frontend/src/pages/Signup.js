import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      login(data.user, data.access_token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050510', padding: 20 };
  const cardStyle = { background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 16, padding: 40, width: '100%', maxWidth: 480 };
  const inputStyle = { width: '100%', padding: '12px 16px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 10, color: '#e8e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '13px', background: loading ? '#333' : 'linear-gradient(135deg,#00b894,#00cec9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Create your account</h2>
        <p style={{ color: '#888899', fontSize: 14, marginBottom: 28 }}>Build AI-powered resumes in minutes</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#888899' }}>Full Name</label>
          <input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#888899' }}>Email Address</label>
          <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#888899' }}>Password</label>
          <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#888899' }}>Confirm Password</label>
          <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="********" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button style={btnStyle} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account ->'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888899' }}>
          Already have an account? <Link to="/login" style={{ color: '#00b894', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
