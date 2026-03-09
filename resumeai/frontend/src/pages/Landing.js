import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8f0' }}>
      {/* Hero */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: '#00b894', marginBottom: 24 }}>
          🚀 AI-Powered Resume Builder
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
          Build Resumes That<br />
          <span style={{ background: 'linear-gradient(135deg,#00b894,#00cec9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get You Hired</span>
        </h1>
        <p style={{ fontSize: 18, color: '#888899', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}>
          AI-powered resume analysis, ATS scoring, and professional templates to help you land your dream job faster.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup"><button style={{ padding: '14px 32px', background: 'linear-gradient(135deg,#00b894,#00cec9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Get Started Free →</button></Link>
          <Link to="/login"><button style={{ padding: '14px 32px', background: 'transparent', border: '1px solid #1e1e2e', borderRadius: 10, color: '#e8e8f0', fontSize: 16, cursor: 'pointer' }}>Sign In</button></Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {[
            ['📊', 'ATS Score Analysis', 'Get instant feedback on how your resume performs against Applicant Tracking Systems.'],
            ['🤖', 'AI Optimization', 'Claude AI rewrites and optimizes your resume for maximum impact and keyword matching.'],
            ['🎨', 'Professional Templates', '8 stunning templates designed for different industries and career levels.'],
            ['⚡', 'Instant PDF Export', 'Download your polished resume as a professional PDF in one click.'],
            ['🔑', 'Keyword Matching', 'Identify missing keywords from job descriptions and add them intelligently.'],
            ['📈', 'Career Progress', 'Track your resume improvements and ATS scores over time.']
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
              <p style={{ color: '#888899', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#16161e', borderTop: '1px solid #1e1e2e', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Ready to land your dream job?</h2>
        <p style={{ color: '#888899', marginBottom: 28 }}>Join thousands of job seekers who got hired faster with ResumeAI.</p>
        <Link to="/signup"><button style={{ padding: '14px 36px', background: 'linear-gradient(135deg,#00b894,#00cec9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Start Building — It's Free →</button></Link>
      </div>
    </div>
  );
}
