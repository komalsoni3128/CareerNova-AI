import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { generateInterviewQuestions, scoreInterviewAnswer } from '../api'

export default function InterviewPrep() {
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('entry')
  const [focus, setFocus] = useState('mixed')
  const [questions, setQuestions] = useState([])
  const [active, setActive] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [scoring, setScoring] = useState(false)

  async function loadQuestions(event) {
    event.preventDefault()
    setError('')
    setFeedback(null)
    if (role.trim().length < 2) {
      setError('Enter the role you are interviewing for.')
      return
    }
    setLoading(true)
    try {
      const data = await generateInterviewQuestions({ role, level, focus })
      setQuestions(data.questions)
      setActive(0)
      setAnswer('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function scoreAnswer(event) {
    event.preventDefault()
    const question = questions[active]
    if (!question) return
    setError('')
    if (answer.trim().length < 12) {
      setError('Give a fuller answer so the coach has something to evaluate.')
      return
    }
    setScoring(true)
    try {
      const data = await scoreInterviewAnswer({
        role,
        question: question.question,
        answer,
      })
      setFeedback(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setScoring(false)
    }
  }

  const current = questions[active]

  return (
    <div className="container section">
      <PageHeader
        eyebrow="Interview preparation"
        title="Practice the questions this role actually asks"
        text="Questions and feedback come from the AI API. Use this as a rehearsal room, not a script to memorize."
      />

      <form className="card" onSubmit={loadQuestions}>
        <div className="form-grid">
          <label className="field">
            Role
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Backend intern" />
          </label>
          <label className="field">
            Level
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </label>
          <label className="field">
            Focus
            <select value={focus} onChange={(e) => setFocus(e.target.value)}>
              <option value="mixed">Mixed</option>
              <option value="behavioral">Behavioral</option>
              <option value="technical">Technical</option>
            </select>
          </label>
        </div>
        <div className="toolbar">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating…' : 'Generate questions'}
          </button>
        </div>
      </form>

      {error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : null}

      {current ? (
        <div className="grid-2" style={{ marginTop: 18 }}>
          <div className="card">
            <p className="eyebrow">
              {current.type} · {active + 1}/{questions.length}
            </p>
            <h3>{current.question}</h3>
            <p className="lede">{current.tip}</p>
            <div className="toolbar">
              <button
                className="btn btn-ghost"
                type="button"
                disabled={active === 0}
                onClick={() => {
                  setActive((n) => n - 1)
                  setAnswer('')
                  setFeedback(null)
                }}
              >
                Previous
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                disabled={active === questions.length - 1}
                onClick={() => {
                  setActive((n) => n + 1)
                  setAnswer('')
                  setFeedback(null)
                }}
              >
                Next
              </button>
            </div>
          </div>
          <form className="card" onSubmit={scoreAnswer}>
            <label className="field">
              Your answer
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </label>
            <button className="btn btn-primary" disabled={scoring}>
              {scoring ? 'Scoring…' : 'Get mock-interview feedback'}
            </button>
            {feedback ? (
              <div>
                <h3>Score: {feedback.score}/100</h3>
                <p>{feedback.verdict}</p>
                <h4>What worked</h4>
                <ul className="list">
                  {(feedback.whatWorked || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h4>Improve</h4>
                <ul className="list">
                  {(feedback.improve || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h4>Stronger version</h4>
                <p>{feedback.strongerAnswer}</p>
                <h4>Follow-up you might hear</h4>
                <p>{feedback.followUpQuestion}</p>
              </div>
            ) : null}
          </form>
        </div>
      ) : null}
    </div>
  )
}
