import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirm) { toast.error('Please fill all fields'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', { name, email, password });
      login(data.user, data.access_token);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Signup failed');
    } finally { setLoading(false); }
  };

  const pageStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: 20 };
  const cardStyle = { background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 16, padding: 40, width: '100%', maxWidth: 440 };
  const inputStyle = { width: '100%', padding: '12px 16px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 10, color: '#e8e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '13px', background: loading ? '#333' : 'linear-gradient(135deg,#00b894,#00cec9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Create account</h2>
        <p style={{ color: '#888899', fontSize: 14, marginBottom: 28 }}>Start building resumes that get hired</p>
        {[['Full Name','text',name,setName,'Atif Bashir'],['Email Address','email',email,setEmail,'you@example.com'],['Password','password',password,setPassword,'••••••••'],['Confirm Password','password',confirm,setConfirm,'••••••••']].map(([label,type,val,setter,ph]) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#888899' }}>{label}</label>
            <input style={inputStyle} type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
        ))}
        <button style={{...btnStyle, marginTop: 8}} onClick={handleSubmit} disabled={loading}>{loading ? 'Creating account...' : 'Create Account →'}</button>
        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#555566' }}>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#888899' }}>
          Already have an account? <Link to="/login" style={{ color: '#00b894', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
