import React from 'react';
import { useNavigate } from 'react-router-dom';

const TEMPLATES = [
  { id:'modern-pro', name:'Modern Pro', color:'#00b894', desc:'Clean and contemporary design for modern professionals' },
  { id:'executive', name:'Executive', color:'#2980b9', desc:'Sophisticated layout for senior-level positions' },
  { id:'creative-bold', name:'Creative Bold', color:'#8e44ad', desc:'Stand out with bold typography and vibrant accents' },
  { id:'minimal-clean', name:'Minimal Clean', color:'#555', desc:'Simple and elegant — let your experience speak' },
  { id:'tech-dark', name:'Tech Dark', color:'#e67e22', desc:'Dark theme perfect for developers and engineers' },
  { id:'academic', name:'Academic', color:'#c0392b', desc:'Formal layout for research and academic roles' },
  { id:'startup', name:'Startup', color:'#00b894', desc:'Dynamic design for startup and entrepreneurial roles' },
  { id:'elegant', name:'Elegant', color:'#b8860b', desc:'Refined gold accents for luxury brand positions' },
];

export default function Templates() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:28, fontWeight:700, marginBottom:8 }}>Resume Templates</h1>
      <p style={{ color:'#888899', marginBottom:36 }}>Choose a professional template and start building</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
        {TEMPLATES.map(t => (
          <div key={t.id} style={{ background:'#16161e', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' }}>
            {/* Preview */}
            <div style={{ background:'#111118', padding:20, height:180, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="160" height="140" viewBox="0 0 160 140">
                <rect width="160" height="140" fill="#1a1a2e" rx="4"/>
                <rect x="10" y="10" width="80" height="8" fill={t.color} rx="2" opacity="0.9"/>
                <rect x="10" y="22" width="50" height="4" fill="#555" rx="2"/>
                <rect x="10" y="30" width="140" height="1" fill={t.color} opacity="0.5"/>
                <rect x="10" y="36" width="35" height="4" fill={t.color} rx="2"/>
                <rect x="10" y="44" width="140" height="3" fill="#333" rx="1"/>
                <rect x="10" y="50" width="120" height="3" fill="#333" rx="1"/>
                <rect x="10" y="60" width="35" height="4" fill={t.color} rx="2"/>
                <rect x="10" y="68" width="90" height="3" fill="#333" rx="1"/>
                <rect x="10" y="74" width="70" height="3" fill="#333" rx="1"/>
                <rect x="10" y="84" width="35" height="4" fill={t.color} rx="2"/>
                <rect x="10" y="92" width="100" height="3" fill="#333" rx="1"/>
                <rect x="10" y="98" width="80" height="3" fill="#333" rx="1"/>
                <rect x="10" y="108" width="35" height="4" fill={t.color} rx="2"/>
                <rect x="10" y="116" width="60" height="3" fill="#333" rx="1"/>
                <rect x="75" y="116" width="50" height="3" fill="#333" rx="1"/>
              </svg>
            </div>
            <div style={{ padding:20 }}>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:17, fontWeight:600, marginBottom:6 }}>{t.name}</h3>
              <p style={{ color:'#888899', fontSize:13, lineHeight:1.5, marginBottom:16 }}>{t.desc}</p>
              <button onClick={() => navigate('/builder')} style={{ width:'100%', padding:'10px', background:`linear-gradient(135deg,${t.color},${t.color}cc)`, border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Use This Template →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
