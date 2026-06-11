import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

function Admin({ user }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    category: 'General',
    difficulty: 'medium',
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') return
    loadQuestions()
  }, [user])

  async function loadQuestions() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('questions').select('*')
      if (!error && data) {
        setQuestions(data)
      } else {
        setQuestions([])
      }
    } catch {
      setQuestions([])
    }
    setLoading(false)
  }

  const handleOptionChange = (idx, value) => {
    const next = [...form.options]
    next[idx] = value
    setForm({ ...form, options: next })
  }

  const resetForm = () => {
    setForm({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      category: 'General',
      difficulty: 'medium',
    })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const payload = {
      question_text: form.question_text,
      options: form.options,
      correct_answer: Number(form.correct_answer),
      category: form.category,
      difficulty: form.difficulty,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('questions')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
        setMessage('Question updated successfully!')
      } else {
        const { error } = await supabase.from('questions').insert(payload)
        if (error) throw error
        setMessage('Question added successfully!')
      }
      resetForm()
      loadQuestions()
    } catch {
      setMessage('Save failed. Ensure the Supabase table exists.')
    }
  }

  const handleEdit = (q) => {
    setForm({
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      category: q.category || 'General',
      difficulty: q.difficulty || 'medium',
    })
    setEditingId(q.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return
    try {
      const { error } = await supabase.from('questions').delete().eq('id', id)
      if (error) throw error
      setMessage('Question deleted.')
      loadQuestions()
    } catch {
      setMessage('Delete failed.')
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="admin-page">
        <p className="error-message">Access denied. Admins only.</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <h2>Admin Panel</h2>

      {message && <div className="info-message">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Question</label>
          <textarea
            value={form.question_text}
            onChange={(e) => setForm({ ...form, question_text: e.target.value })}
            placeholder="Enter question text"
            required
            rows={2}
          />
        </div>

        <div className="options-row">
          {form.options.map((opt, i) => (
            <div className="form-group" key={i}>
              <label>Option {String.fromCharCode(65 + i)}</label>
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                required
              />
            </div>
          ))}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Correct Answer</label>
            <select
              value={form.correct_answer}
              onChange={(e) => setForm({ ...form, correct_answer: Number(e.target.value) })}
            >
              {form.options.map((_, i) => (
                <option key={i} value={i}>
                  {String.fromCharCode(65 + i)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Question' : 'Add Question'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>Existing Questions</h3>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : questions.length === 0 ? (
        <p>No questions found in the database.</p>
      ) : (
        <ul className="admin-list">
          {questions.map((q) => (
            <li key={q.id} className="admin-list-item">
              <div>
                <strong>{q.question_text}</strong>
                <span className="admin-tag">{q.category}</span>
                <span className="admin-tag">{q.difficulty}</span>
              </div>
              <div className="admin-actions">
                <button className="btn btn-sm btn-outline" onClick={() => handleEdit(q)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(q.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Admin