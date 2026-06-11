import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

function Results({ score, total, user, onGoHome, onLeaderboard }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function saveResult() {
      if (!user || submitted) return
      try {
        const { error: insertError } = await supabase.from('submissions').insert({
          user_id: user.user_id,
          score: score,
          submitted_at: new Date().toISOString(),
        })
        if (insertError) throw insertError
        setSubmitted(true)
      } catch (err) {
        const localScores = JSON.parse(localStorage.getItem('local_scores') || '[]')
        localScores.push({
          id: Date.now(),
          user_id: user.user_id,
          score: score,
          total_questions: total,
          submitted_at: new Date().toISOString(),
        })
        localStorage.setItem('local_scores', JSON.stringify(localScores))
        setError(`Saved locally. Supabase error: ${err.message || 'Unknown error'}`)
        setSubmitted(true)
      }
    }
    saveResult()
  }, [user, score, total, submitted])

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  let message = ''
  if (percentage >= 80) message = 'Outstanding!'
  else if (percentage >= 60) message = 'Great job!'
  else if (percentage >= 40) message = 'Good effort!'
  else message = 'Keep practicing!'

  return (
    <div className="results-page">
      <div className="results-card">
        <h2>Quiz Results</h2>

        <div className="results-score-circle">
          <span className="results-percent">{percentage}%</span>
          <span className="results-fraction">{score} / {total}</span>
        </div>

        <p className="results-message">{message}</p>
        {error && <p className="results-error">{error}</p>}

        {/* <div className="results-actions">
          <button className="btn btn-primary" onClick={onGoHome}>
            Play Again
          </button>
          <button className="btn btn-outline" onClick={onLeaderboard}>
            View Leaderboard
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default Results