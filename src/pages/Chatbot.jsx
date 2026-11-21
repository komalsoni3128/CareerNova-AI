import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { sendChat } from '../api'

const starters = [
  'How do I explain a career gap on my resume?',
  'What should a CS junior put in a one-page resume?',
  'Help me prep for a product management internship interview.',
]

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi — I am CareerNova AI. Ask me about resumes, interviews, internships, or which skills to learn next. I answer from the live model, not a fixed script.',
    },
  ])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const scroller = useRef(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function onSubmit(event) {
    event.preventDefault()
    const text = input.trim()
    if (text.length < 2) {
      setError('Type a question first.')
      return
    }
    setError('')
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const history = next.filter((m, index) => index > 0)
      const data = await sendChat(history)
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message)
      setMessages(next)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container section">
      <PageHeader
        eyebrow="AI career assistant"
        title="A coach you can actually talk to"
        text="Every reply is generated through the backend API. Put GROQ_API_KEY or OPENAI_API_KEY in your .env file."
      />

      <div className="card chat-window">
        <div className="messages" ref={scroller}>
          {messages.map((message, index) => (
            <div key={index} className={`bubble ${message.role}`}>
              {message.content}
            </div>
          ))}
          {loading ? <div className="bubble assistant">Thinking…</div> : null}
        </div>
        <div className="chip-row" style={{ marginBottom: 12 }}>
          {starters.map((item) => (
            <button key={item} className="chip" type="button" onClick={() => setInput(item)} disabled={loading}>
              {item}
            </button>
          ))}
        </div>
        {error ? (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        ) : null}
        <form className="chat-form" onSubmit={onSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a job, a resume line, or an interview story…"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <button className="btn btn-primary" disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
