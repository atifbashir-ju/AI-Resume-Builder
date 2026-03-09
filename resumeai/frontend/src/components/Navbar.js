import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #1e1e2e', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px'
  };

  const logoStyle = {
    display: 'flex', alignItems: 'center', gap: '10px',
    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: '#e8e8f0'
  };

  const btnStyle = (primary) => ({
    padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
    border: primary ? 'none' : '1px solid #1e1e2e',
    background: primary ? 'linear-gradient(135deg,#00b894,#00cec9)' : 'transparent',
    color: primary ? '#fff' : '#888899', cursor: 'pointer'
  });

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        <div style={{width:32,height:32,background:'linear-gradient(135deg,#00b894,#00cec9)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,color:'#fff'}}>R</div>
        ResumeAI
      </Link>

      {!user ? (
        <div style={{display:'flex',gap:10}}>
          <Link to="/login"><button style={btnStyle(false)}>Log In</button></Link>
          <Link to="/signup"><button style={btnStyle(true)}>Get Started</button></Link>
        </div>
      ) : (
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          {[['Dashboard','/dashboard'],['Analyzer','/analyzer'],['Builder','/builder'],['Templates','/templates']].map(([label,path]) => (
            <Link key={path} to={path} style={{fontSize:14,color:location.pathname===path?'#00b894':'#888899',fontWeight:location.pathname===path?600:400}}>{label}</Link>
          ))}
          <Link to="/profile" style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#00b894,#00cec9)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#fff',fontSize:13}}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </Link>
          <button onClick={handleLogout} style={btnStyle(false)}>Logout</button>
        </div>
      )}
    </nav>
  );
}
