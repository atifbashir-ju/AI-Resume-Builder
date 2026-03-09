import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TEMPLATES = ['modern-pro','executive','creative-bold','minimal-clean','tech-dark','academic','startup','elegant'];

const emptyData = {
  personal: { name:'', email:'', phone:'', location:'', linkedin:'', website:'', summary:'' },
  experience: [{ role:'', company:'', start_date:'', end_date:'', current:false, description:'' }],
  education: [{ institution:'', degree:'', field:'', start_year:'', end_year:'', gpa:'' }],
  skills: { technical:'', tools:'', soft:'' },
  projects: [{ name:'', technologies:'', description:'', link:'' }],
  certifications: [{ name:'', issuer:'', year:'' }]
};

export default function Builder() {
  const [data, setData] = useState(emptyData);
  const [template, setTemplate] = useState('modern-pro');
  const [title] = useState('My Resume');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('personal');

  const update = (section, field, value, idx) => {
    setData(prev => {
      if (idx !== undefined) {
        const arr = [...prev[section]];
        arr[idx] = { ...arr[idx], [field]: value };
        return { ...prev, [section]: arr };
      }
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  };

  const downloadPDF = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/resume/generate-pdf', { title, template, resume_data: data }, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = 'resume.pdf'; a.click();
      toast.success('PDF downloaded!');
    } catch { toast.error('PDF generation failed'); }
    finally { setLoading(false); }
  };

  const inp = (val, onChange, ph='', type='text') => (
    <input type={type} value={val} onChange={e => onChange(e.target.value)} placeholder={ph}
      style={{ width:'100%', padding:'10px 14px', background:'#111118', border:'1px solid #1e1e2e', borderRadius:8, color:'#e8e8f0', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
  );
  const ta = (val, onChange, ph='') => (
    <textarea value={val} onChange={e => onChange(e.target.value)} placeholder={ph} rows={3}
      style={{ width:'100%', padding:'10px 14px', background:'#111118', border:'1px solid #1e1e2e', borderRadius:8, color:'#e8e8f0', fontSize:14, outline:'none', resize:'vertical', boxSizing:'border-box', marginBottom:12 }} />
  );

  const tabs = ['personal','experience','education','skills','projects','certifications'];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:28, fontWeight:700, marginBottom:4 }}>Resume Builder</h1>
          <p style={{ color:'#888899', fontSize:14 }}>Fill in your details and download as PDF</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <select value={template} onChange={e => setTemplate(e.target.value)} style={{ padding:'8px 14px', background:'#16161e', border:'1px solid #1e1e2e', borderRadius:8, color:'#e8e8f0', fontSize:14, cursor:'pointer' }}>
            {TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={downloadPDF} disabled={loading} style={{ padding:'10px 24px', background: loading?'#333':'linear-gradient(135deg,#00b894,#00cec9)', border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:600, cursor: loading?'not-allowed':'pointer' }}>
            {loading ? 'Generating...' : '⬇️ Download PDF'}
          </button>
        </div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:'8px 16px', background:tab===t?'rgba(0,184,148,0.2)':'#16161e', border:`1px solid ${tab===t?'#00b894':'#1e1e2e'}`, borderRadius:8, color:tab===t?'#00b894':'#888899', fontSize:13, fontWeight:tab===t?600:400, cursor:'pointer', textTransform:'capitalize' }}>{t}</button>
        ))}
      </div>

      <div style={{ background:'#16161e', border:'1px solid #1e1e2e', borderRadius:14, padding:28 }}>
        {tab === 'personal' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
              {inp(data.personal.name, v => update('personal','name',v), 'Full Name')}
              {inp(data.personal.email, v => update('personal','email',v), 'Email', 'email')}
              {inp(data.personal.phone, v => update('personal','phone',v), 'Phone')}
              {inp(data.personal.location, v => update('personal','location',v), 'Location')}
              {inp(data.personal.linkedin, v => update('personal','linkedin',v), 'LinkedIn URL')}
              {inp(data.personal.website, v => update('personal','website',v), 'Website')}
            </div>
            {ta(data.personal.summary, v => update('personal','summary',v), 'Professional Summary...')}
          </div>
        )}

        {tab === 'experience' && data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom:24, paddingBottom:24, borderBottom: i<data.experience.length-1?'1px solid #1e1e2e':'none' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
              {inp(exp.role, v => update('experience','role',v,i), 'Job Title')}
              {inp(exp.company, v => update('experience','company',v,i), 'Company')}
              {inp(exp.start_date, v => update('experience','start_date',v,i), 'Start Date (e.g. Jan 2022)')}
              {inp(exp.end_date, v => update('experience','end_date',v,i), 'End Date')}
            </div>
            {ta(exp.description, v => update('experience','description',v,i), 'Describe your responsibilities and achievements...')}
          </div>
        ))}

        {tab === 'education' && data.education.map((edu, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
            {inp(edu.institution, v => update('education','institution',v,i), 'University / School')}
            {inp(edu.degree, v => update('education','degree',v,i), 'Degree (e.g. Bachelor\'s)')}
            {inp(edu.field, v => update('education','field',v,i), 'Field of Study')}
            {inp(edu.gpa, v => update('education','gpa',v,i), 'GPA (optional)')}
            {inp(edu.start_year, v => update('education','start_year',v,i), 'Start Year')}
            {inp(edu.end_year, v => update('education','end_year',v,i), 'End Year')}
          </div>
        ))}

        {tab === 'skills' && (
          <div>
            {ta(data.skills.technical, v => update('skills','technical',v), 'Technical Skills (e.g. Python, React, SQL...)')}
            {ta(data.skills.tools, v => update('skills','tools',v), 'Tools & Frameworks (e.g. Git, Docker, AWS...)')}
            {ta(data.skills.soft, v => update('skills','soft',v), 'Soft Skills (e.g. Leadership, Communication...)')}
          </div>
        )}

        {tab === 'projects' && data.projects.map((proj, i) => (
          <div key={i}>
            {inp(proj.name, v => update('projects','name',v,i), 'Project Name')}
            {inp(proj.technologies, v => update('projects','technologies',v,i), 'Technologies Used')}
            {inp(proj.link, v => update('projects','link',v,i), 'Project Link (optional)')}
            {ta(proj.description, v => update('projects','description',v,i), 'Project description...')}
          </div>
        ))}

        {tab === 'certifications' && data.certifications.map((cert, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0 16px' }}>
            {inp(cert.name, v => update('certifications','name',v,i), 'Certification Name')}
            {inp(cert.issuer, v => update('certifications','issuer',v,i), 'Issuing Organization')}
            {inp(cert.year, v => update('certifications','year',v,i), 'Year')}
          </div>
        ))}
      </div>
    </div>
  );
}