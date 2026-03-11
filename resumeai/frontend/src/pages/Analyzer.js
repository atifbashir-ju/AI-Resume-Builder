import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Analyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] },
    onDrop: async (files) => {
      const file = files[0];
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
        toast.success('File loaded!');
      } else {
        toast('PDF text extraction coming soon — please paste text below', { icon: '📄' });
      }
    }
  });

  const analyze = async () => {
    if (!resumeText.trim()) { toast.error('Please add your resume text'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/resume/analyze', { resume_text: resumeText, job_description: jobDesc });
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error('Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };

  const scoreColor = (score) => score >= 80 ? '#00b894' : score >= 60 ? '#f39c12' : '#e74c3c';

  const downloadAnalyzedPdf = () => {
    if (!result?.download_pdf) {
      toast.error('Download not ready yet');
      return;
    }
    try {
      setDownloading(true);
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${result.download_pdf}`;
      link.download = result.download_filename || 'resumeai-analysis.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Resume downloaded');
    } catch {
      toast.error('Failed to download resume');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Resume Analyzer</h1>
      <p style={{ color: '#888899', marginBottom: 32 }}>Get your ATS score and AI-powered suggestions</p>

      <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? '#00b894' : '#1e1e2e'}`, borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 20, cursor: 'pointer', background: isDragActive ? 'rgba(0,184,148,0.05)' : '#16161e' }}>
        <input {...getInputProps()} />
        <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
        <p style={{ color: '#888899', fontSize: 15 }}>{isDragActive ? 'Drop it here!' : 'Drag & drop your resume, or click to browse'}</p>
        <p style={{ color: '#555566', fontSize: 13, marginTop: 4 }}>Supports .txt files (PDF coming soon)</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#888899' }}>Resume Text</label>
        <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here..." style={{ width: '100%', minHeight: 180, padding: '12px 16px', background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 10, color: '#e8e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#888899' }}>Job Description (Optional)</label>
        <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste job description for better keyword matching..." style={{ width: '100%', minHeight: 100, padding: '12px 16px', background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 10, color: '#e8e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
      </div>

      <button onClick={analyze} disabled={loading} style={{ padding: '12px 32px', background: loading ? '#333' : 'linear-gradient(135deg,#00b894,#00cec9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 32 }}>
        {loading ? 'Analyzing...' : '🔍 Analyze Resume'}
      </button>

      {result && (
        <div>
          <div style={{ background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 14, padding: 28, marginBottom: 20, textAlign: 'center' }}>
            <p style={{ color: '#888899', fontSize: 14, marginBottom: 8 }}>ATS Score</p>
            <div style={{ fontSize: 64, fontWeight: 800, color: scoreColor(result.ats_score), fontFamily: 'Space Grotesk,sans-serif' }}>{result.ats_score}</div>
            <div style={{ fontSize: 24, color: '#888899' }}>/100</div>
            <p style={{ color: scoreColor(result.ats_score), marginTop: 8, fontWeight: 600 }}>
              {result.ats_score >= 80 ? '🎉 Excellent!' : result.ats_score >= 60 ? '👍 Good, but improvable' : '⚠️ Needs improvement'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: '#00b894' }}>✅ Keywords Found</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.keywords_found?.map(kw => <span key={kw} style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>{kw}</span>)}
              </div>
            </div>
            <div style={{ background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: '#e74c3c' }}>❌ Missing Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.missing_keywords?.map(kw => <span key={kw} style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>{kw}</span>)}
              </div>
            </div>
          </div>

          <div style={{ background: '#16161e', border: '1px solid #1e1e2e', borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>💡 Suggestions</h3>
            {result.suggestions?.map((s, i) => <p key={i} style={{ color: '#888899', fontSize: 14, marginBottom: 8, paddingLeft: 16 }}>• {s}</p>)}
          </div>

          {result.download_pdf && (
            <div style={{ marginTop: 24, background: '#111118', border: '1px solid #1e1e2e', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#00b894' }}>Use This Resume 🚀</h3>
              <p style={{ color: '#888899', fontSize: 14 }}>{result.download_message || 'You can download the analyzed resume instantly and use it anywhere.'}</p>
              <button onClick={downloadAnalyzedPdf} disabled={downloading} style={{ alignSelf: 'flex-start', padding: '10px 22px', background: downloading ? '#333' : 'linear-gradient(135deg,#00b894,#00cec9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: downloading ? 'not-allowed' : 'pointer' }}>
                {downloading ? 'Preparing...' : 'Download Resume PDF'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
