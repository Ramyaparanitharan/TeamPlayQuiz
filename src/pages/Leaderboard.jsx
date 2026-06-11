import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let allEntries = []
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .order('score', { ascending: false })
          .limit(50)

        if (!error && data) {
          allEntries = data
        }
      } catch {
        /* ignore */
      }

      try {
        const localScores = JSON.parse(localStorage.getItem('local_scores') || '[]')
        allEntries = [...allEntries, ...localScores]
        allEntries.sort((a, b) => b.score - a.score)
        allEntries = allEntries.slice(0, 50)
      } catch {
        /* ignore */
      }

      setEntries(allEntries)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>
  }

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard</h2>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No scores yet. Be the first to play!</p>
        </div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={entry.id || idx} className={idx < 3 ? 'top-rank' : ''}>
                <td>
                  {idx === 0 && <span className="rank-badge gold">1</span>}
                  {idx === 1 && <span className="rank-badge silver">2</span>}
                  {idx === 2 && <span className="rank-badge bronze">3</span>}
                  {idx > 2 && <span className="rank-badge">{idx + 1}</span>}
                </td>
                <td>{entry.user_id}</td>
                <td>
                  <strong>{entry.score}</strong>
                  {entry.total_questions && (
                    <span className="total-label"> / {entry.total_questions}</span>
                  )}
                </td>
                <td>
                  {entry.submitted_at
                    ? new Date(entry.submitted_at).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Leaderboard