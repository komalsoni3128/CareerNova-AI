import { useEffect, useState } from 'react'
import { checkHealth } from '../api'

export default function HealthBanner() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    checkHealth().then(setHealth)
  }, [])

  if (!health) return null

  if (!health.ok) {
    return (
      <div className="container">
        <div className="alert alert-error" role="status">
          Cannot reach the API at port 3001. Run `npm run dev` so the server and site start together.
        </div>
      </div>
    )
  }

  if (!health.aiConfigured) {
    return (
      <div className="container">
        <div className="alert alert-error" role="status">
          Server is running, but no AI key is set. Add GROQ_API_KEY or OPENAI_API_KEY to `.env` and
          restart.
        </div>
      </div>
    )
  }

  return null
}
