import { useState } from 'react'
import { supabase } from '../supabase.js'

function Login({ onLogin }) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Hardcoded demo/admin credentials always take precedence
    if (userId === 'admin' && password === 'admin') {
      onLogin({ user_id: 'admin', name: 'Admin User', role: 'admin' })
      setLoading(false)
      return
    }
    if (userId === 'demo' && password === 'demo') {
      onLogin({ user_id: 'demo', name: 'Demo Player', role: 'player' })
      setLoading(false)
      return
    }

    try {
      const { data, error: supaError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (supaError || !data) {
        setError('Invalid user ID or password')
        setLoading(false)
        return
      }

      if (data.password === password) {
        onLogin({
          user_id: data.user_id,
          name: data.name || data.user_id,
          role: data.role || 'player',
        })
      } else {
        setError('Invalid user ID or password')
      }
    } catch {
      setError('Unable to connect. Use demo / demo or admin / admin')
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Quiz Game</h1>
        <p className="login-subtitle">Test your knowledge and climb the leaderboard!</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-hint">
          <p>Demo credentials:</p>
          <code>demo / demo</code> (player) &nbsp;|&nbsp; <code>admin / admin</code> (admin)
        </div>
      </div>
    </div>
  )
}

export default Login