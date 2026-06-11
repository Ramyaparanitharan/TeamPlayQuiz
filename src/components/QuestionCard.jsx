import { useState, useEffect } from 'react'

function QuestionCard({ question, index, total, onAnswer, timeLeft }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSelected(null)
    setSubmitted(false)
  }, [question.id])

  const handleSelect = (optionIndex) => {
    if (submitted) return
    setSelected(optionIndex)
  }

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    const isCorrect = selected === question.correct_answer
    onAnswer(isCorrect)
  }

  const getOptionClass = (optionIndex) => {
    let cls = 'option-btn'
    if (selected === optionIndex) cls += ' selected'
    if (submitted) {
      if (optionIndex === question.correct_answer) cls += ' correct'
      else if (selected === optionIndex) cls += ' wrong'
    }
    return cls
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-counter">
          Question {index + 1} of {total}
        </span>
        <span className={`timer ${timeLeft <= 5 ? 'timer-warning' : ''}`}>
          {timeLeft}s
        </span>
      </div>

      <h3 className="question-text">{question.question_text}</h3>

      <div className="options-grid">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={getOptionClass(i)}
            onClick={() => handleSelect(i)}
            disabled={submitted}
          >
            <span className="option-label">{String.fromCharCode(65 + i)}</span>
            <span className="option-text">{opt}</span>
          </button>
        ))}
      </div>

      {!submitted ? (
        <button
          className="btn btn-primary submit-btn"
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Submit Answer
        </button>
      ) : (
        <div className="feedback">
          {selected === question.correct_answer ? (
            <span className="feedback-correct">Correct!</span>
          ) : (
            <span className="feedback-wrong">
              Wrong! The correct answer was{' '}
              <strong>{question.options[question.correct_answer]}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionCard