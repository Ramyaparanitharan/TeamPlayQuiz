import { useState, useEffect, useCallback, useRef } from 'react'
import QuestionCard from '../components/QuestionCard.jsx'

function Quiz({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isPaused, setIsPaused] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const scoreRef = useRef(score)

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    setCurrentIndex(0)
    setScore(0)
    scoreRef.current = 0
    setTimeLeft(15)
    setIsPaused(false)
    setShowSummary(false)
  }, [questions])

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  const goNext = useCallback(() => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((i) => i + 1)
      setTimeLeft(15)
    } else {
      setShowSummary(true)
      setTimeout(() => onComplete(scoreRef.current), 800)
    }
  }, [currentIndex, totalQuestions, onComplete])

  useEffect(() => {
    if (isPaused || showSummary) return
    if (timeLeft <= 0) {
      goNext()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, isPaused, showSummary, goNext])

  const handleAnswer = (isCorrect) => {
    setIsPaused(true)
    if (isCorrect) {
      setScore((s) => s + 1)
    }
    setTimeout(() => {
      setIsPaused(false)
      goNext()
    }, 1200)
  }

  if (totalQuestions === 0) {
    return <div className="loading">No questions available.</div>
  }

  const progressPercent = ((currentIndex) / totalQuestions) * 100

  return (
    <div className="quiz-page">
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="quiz-stats">
        <span>Score: {score}</span>
        <span>Question {Math.min(currentIndex + 1, totalQuestions)} / {totalQuestions}</span>
      </div>

      {currentQuestion && !showSummary && (
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={totalQuestions}
          onAnswer={handleAnswer}
          timeLeft={timeLeft}
        />
      )}

      {showSummary && (
        <div className="summary-card">
          <h2>Quiz Complete!</h2>
          <p className="summary-score">
            You scored <strong>{score}</strong> out of <strong>{totalQuestions}</strong>
          </p>
        </div>
      )}
    </div>
  )
}

export default Quiz