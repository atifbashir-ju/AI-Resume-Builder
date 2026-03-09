import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put('/api/auth/profile', { name, email });
      login(data, localStorage.getItem('token'));
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.detail || 'Update failed'); }
    finally { setLoading(false); }
  };

  const changePassword = async () => {
    if (!currentPw || !newPw) { toast.error('Fill both password fields'); return; }
    setLoading(true);
    try {
      await axios.put('/api/auth/password', { current_password: currentPw, new_password: newPw });
      toast.success('Password changed!');
      setCurrentPw(''); setNewPw('');
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed'); }
    finally { setLoading(false); }
  };

  const inp = (val, setter, ph, type='text') => (
    <input type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph}
      style={{ width:'100%', padding:'11px 14px', background:'#111118', border:'1px solid #1e1e2e', borderRadius:8, color:'#e8e8f0', fontSize:15, outline:'none', boxSizing:'border-box', marginBottom:14 }} />
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:28, fontWeight:700, marginBottom:32 }}>My Profile</h1>

      <div style={{ background:'#16161e', border:'1px solid #1e1e2e', borderRadius:14, padding:28, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <div style={{ width:60, height:60, background:'linear-gradient(135deg,#00b894,#00cec9)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#fff' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight:600, fontSize:18 }}>{user?.name}</div>
            <div style={{ color:'#888899', fontSize:14 }}>{user?.email}</div>
            <div style={{ color:'#555566', fontSize:13, marginTop:2 }}>Joined via {user?.provider}</div>
          </div>
        </div>
        <h3 style={{ fontSize:16, fontWeight:600, marginBottom:16 }}>Update Info</h3>
        {inp(name, setName, 'Full Name')}
        {inp(email, setEmail, 'Email', 'email')}
        <button onClick={updateProfile} disabled={loading} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#00b894,#00cec9)', border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer' }}>
          Save Changes
        </button>
      </div>

      {user?.provider !== 'google' && (
        <div style={{ background:'#16161e', border:'1px solid #1e1e2e', borderRadius:14, padding:28 }}>
          <h3 style={{ fontSize:16, fontWeight:600, marginBottom:16 }}>Change Password</h3>
          {inp(currentPw, setCurrentPw, 'Current Password', 'password')}
          {inp(newPw, setNewPw, 'New Password', 'password')}
          <button onClick={changePassword} disabled={loading} style={{ padding:'10px 24px', background:'#333', border:'1px solid #444', borderRadius:8, color:'#e8e8f0', fontSize:14, fontWeight:600, cursor:'pointer' }}>
            Update Password
          </button>
        </div>
      )}
    </div>
  );
}
