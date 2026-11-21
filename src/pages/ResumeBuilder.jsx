import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ResumePreview from '../components/ResumePreview'
import { improveSummary } from '../api'
import { emptyResume, loadResume, sampleResume, saveResume } from '../resumeStorage'

const templates = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'creative', label: 'Creative' },
]

export default function ResumeBuilder() {
  const [resume, setResume] = useState(emptyResume)
  const [ready, setReady] = useState(false)
  const [template, setTemplate] = useState('modern')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setResume(loadResume())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveResume(resume)
  }, [resume, ready])

  function update(field, value) {
    setResume((prev) => ({ ...prev, [field]: value }))
  }

  function updateList(listName, index, field, value) {
    setResume((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  function addItem(listName, blank) {
    setResume((prev) => ({ ...prev, [listName]: [...prev[listName], blank] }))
  }

  function removeItem(listName, index) {
    setResume((prev) => ({
      ...prev,
      [listName]: prev[listName].length === 1 ? prev[listName] : prev[listName].filter((_, i) => i !== index),
    }))
  }

  async function generateSummary() {
    setError('')
    setStatus('')
    if (!resume.fullName.trim() || !resume.skills.trim()) {
      setError('Add your name and at least a few skills before generating a summary.')
      return
    }
    setLoading(true)
    try {
      const data = await improveSummary(resume)
      update('summary', data.summary)
      setStatus('Summary updated from your details.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container section">
      <PageHeader
        eyebrow="Resume builder"
        title="Design a resume that looks hired, not hurried"
        text="Your entries stay in this browser. Switch templates, generate an AI summary, then print or save as PDF."
      />

      <div className="toolbar no-print">
        <div className="templates">
          {templates.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`template-btn ${template === item.id ? 'active' : ''}`}
              onClick={() => setTemplate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost" type="button" onClick={generateSummary} disabled={loading}>
          {loading ? 'Writing summary…' : 'AI summary'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => setResume(sampleResume)}>
          Load sample
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => setResume(structuredClone(emptyResume))}>
          Clear
        </button>
        <button className="btn btn-primary" type="button" onClick={() => window.print()}>
          Print / PDF
        </button>
      </div>

      {error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : null}
      {status ? (
        <div className="alert alert-info" role="status">
          {status}
        </div>
      ) : null}

      <div className="grid-2 builder-layout" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <form className="card no-print" onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid">
            <label className="field">
              Full name
              <input value={resume.fullName} onChange={(e) => update('fullName', e.target.value)} />
            </label>
            <label className="field">
              Target title
              <input value={resume.title} onChange={(e) => update('title', e.target.value)} />
            </label>
            <label className="field">
              Email
              <input type="email" value={resume.email} onChange={(e) => update('email', e.target.value)} />
            </label>
            <label className="field">
              Phone
              <input value={resume.phone} onChange={(e) => update('phone', e.target.value)} />
            </label>
            <label className="field">
              Location
              <input value={resume.location} onChange={(e) => update('location', e.target.value)} />
            </label>
            <label className="field">
              LinkedIn / portfolio
              <input value={resume.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
            </label>
            <label className="field full">
              Skills (comma separated)
              <input value={resume.skills} onChange={(e) => update('skills', e.target.value)} />
            </label>
            <label className="field full">
              Summary
              <textarea value={resume.summary} onChange={(e) => update('summary', e.target.value)} />
            </label>
          </div>

          <h3>Experience</h3>
          {resume.experience.map((item, index) => (
            <div className="repeat-block" key={index}>
              <div className="form-grid">
                <label className="field">
                  Role
                  <input value={item.role} onChange={(e) => updateList('experience', index, 'role', e.target.value)} />
                </label>
                <label className="field">
                  Company
                  <input
                    value={item.company}
                    onChange={(e) => updateList('experience', index, 'company', e.target.value)}
                  />
                </label>
                <label className="field">
                  Dates
                  <input value={item.dates} onChange={(e) => updateList('experience', index, 'dates', e.target.value)} />
                </label>
                <label className="field full">
                  Impact
                  <textarea
                    value={item.details}
                    onChange={(e) => updateList('experience', index, 'details', e.target.value)}
                  />
                </label>
              </div>
              <button className="btn btn-ghost" type="button" onClick={() => removeItem('experience', index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => addItem('experience', { company: '', role: '', dates: '', details: '' })}
          >
            Add experience
          </button>

          <h3>Education</h3>
          {resume.education.map((item, index) => (
            <div className="repeat-block" key={index}>
              <div className="form-grid">
                <label className="field">
                  Degree
                  <input
                    value={item.degree}
                    onChange={(e) => updateList('education', index, 'degree', e.target.value)}
                  />
                </label>
                <label className="field">
                  School
                  <input
                    value={item.school}
                    onChange={(e) => updateList('education', index, 'school', e.target.value)}
                  />
                </label>
                <label className="field">
                  Dates
                  <input value={item.dates} onChange={(e) => updateList('education', index, 'dates', e.target.value)} />
                </label>
              </div>
              <button className="btn btn-ghost" type="button" onClick={() => removeItem('education', index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => addItem('education', { school: '', degree: '', dates: '' })}
          >
            Add education
          </button>

          <h3>Projects</h3>
          {resume.projects.map((item, index) => (
            <div className="repeat-block" key={index}>
              <label className="field">
                Name
                <input value={item.name} onChange={(e) => updateList('projects', index, 'name', e.target.value)} />
              </label>
              <label className="field">
                Details
                <textarea
                  value={item.details}
                  onChange={(e) => updateList('projects', index, 'details', e.target.value)}
                />
              </label>
              <button className="btn btn-ghost" type="button" onClick={() => removeItem('projects', index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => addItem('projects', { name: '', details: '' })}
          >
            Add project
          </button>
        </form>

        <ResumePreview resume={resume} template={template} />
      </div>
    </div>
  )
}
