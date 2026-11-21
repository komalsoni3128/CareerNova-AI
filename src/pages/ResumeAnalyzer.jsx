import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { analyzeResume } from '../api'
import { loadResume, resumeToText } from '../resumeStorage'

export default function ResumeAnalyzer() {
  const savedText = useMemo(() => resumeToText(loadResume()), [])
  const [resumeText, setResumeText] = useState(savedText.trim() ? savedText : '')
  const [targetRole, setTargetRole] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)
    if (resumeText.trim().length < 40) {
      setError('Paste a fuller resume (at least a few sentences) so the analysis is useful.')
      return
    }
    if (!targetRole.trim()) {
      setError('Enter the role you want this resume to compete for.')
      return
    }
    setLoading(true)
    try {
      const data = await analyzeResume(resumeText, targetRole)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container section">
      <PageHeader
        eyebrow="Resume analyzer"
        title="See how a recruiter might read your resume"
        text="We send your text to the AI API through the local server. Keys never sit in the browser."
      />

      <form className="card" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="field">
            Target role
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Frontend intern, data analyst, UX designer…"
            />
          </label>
          <label className="field full">
            Resume text
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste a resume or import from the builder."
              style={{ minHeight: 220 }}
            />
          </label>
        </div>
        <div className="toolbar">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze resume'}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => setResumeText(resumeToText(loadResume()))}
          >
            Load from builder
          </button>
        </div>
      </form>

      {error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid-2" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="score" style={{ '--p': Number(result.overallScore) || 0 }}>
              <span>{result.overallScore ?? '—'}</span>
            </div>
            <h3>Snapshot</h3>
            <p className="lede">{result.summary}</p>
            <h4>Strengths</h4>
            <ul className="list">
              {(result.strengths || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4>Gaps</h4>
            <ul className="list">
              {(result.gaps || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>ATS and keywords</h3>
            <p>
              <strong>Present:</strong> {(result.keywordMatches || []).join(', ') || 'None found'}
            </p>
            <p>
              <strong>Missing:</strong> {(result.missingKeywords || []).join(', ') || 'None'}
            </p>
            <h4>ATS tips</h4>
            <ul className="list">
              {(result.atsTips || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4>Rewrite suggestions</h4>
            {(result.rewriteSuggestions || []).map((item) => (
              <div key={item.section} className="repeat-block">
                <strong>{item.section}</strong>
                <p>
                  <em>Now:</em> {item.current}
                </p>
                <p>
                  <em>Try:</em> {item.improved}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
