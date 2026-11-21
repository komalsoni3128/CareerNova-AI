
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { analyzeSkillGap } from '../api'
import { loadResume } from '../resumeStorage'

export default function SkillGap() {
  const saved = loadResume()
  const [targetRole, setTargetRole] = useState(saved.title || '')
  const [skills, setSkills] = useState(saved.skills || '')
  const [background, setBackground] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!targetRole.trim() || String(skills).trim().length < 3) {
      setError('Add a target role and a short list of skills you already have.')
      return
    }

    setLoading(true)

    try {
      const data = await analyzeSkillGap({
        targetRole,
        skills,
        background,
      })
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
        eyebrow="Skill gap analyzer"
        title="Map the distance between you and the job"
        text="Honest gaps beat vague advice. You will get matched skills, missing skills, and a four-week plan."
      />

      <form className="card" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="field">
            Target role
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </label>

          <label className="field">
            Skills you have
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Python, Excel, teamwork"
            />
          </label>

          <label className="field full">
            Background (optional)
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="Year of study, internships, career switch notes…"
            />
          </label>
        </div>

        <div className="toolbar">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing…' : 'Find the gaps'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="grid-2" style={{ marginTop: 18 }}>
          <div className="card">
            <div
              className="score"
              style={{ '--p': Number(result.fitScore) || 0 }}
            >
              <span>{result.fitScore ?? '—'}</span>
            </div>

            <p className="lede">{result.snapshot}</p>

            <h4>Already in your toolkit</h4>
            <div className="chip-row">
              {(Array.isArray(result.matchedSkills)
                ? result.matchedSkills
                : []
              ).map((skill, index) => (
                <span className="chip" key={index}>
                  {skill}
                </span>
              ))}
            </div>

            <h4>Project ideas</h4>
            <ul className="list">
              {(Array.isArray(result.projectIdeas)
                ? result.projectIdeas
                : []
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Missing skills</h3>

            {(Array.isArray(result.missingSkills)
              ? result.missingSkills
              : []
            ).map((item, index) => (
              <div className="repeat-block" key={index}>
                <strong>{item.skill}</strong>
                <p>{item.whyItMatters}</p>
                <p>
                  <em>Learn by:</em> {item.howToLearn}
                </p>
              </div>
            ))}

            <h3>Learning plan</h3>

            {(Array.isArray(result.learningPlan)
              ? result.learningPlan
              : []
            ).map((item, index) => {
              const actions = Array.isArray(item.actions)
                ? item.actions
                : item.actions
                  ? [item.actions]
                  : []

              return (
                <div className="repeat-block" key={index}>
                  <strong>
                    Week {item.week}: {item.focus}
                  </strong>

                  <ul className="list">
                    {actions.map((action, actionIndex) => (
                      <li key={actionIndex}>
                        {typeof action === 'string'
                          ? action
                          : action?.text || action?.action || JSON.stringify(action)}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
