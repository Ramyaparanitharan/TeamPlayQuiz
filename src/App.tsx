import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Quiz from './pages/Quiz.jsx'
import Results from './pages/Results.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Admin from './pages/Admin.jsx'
import { supabase } from './supabase.js'

export type Question = {
  id: number
  question_text: string
  options: string[]
  correct_answer: number
  category?: string
  difficulty?: string
}

export type User = {
  user_id: string
  name: string
  role: 'admin' | 'player'
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question_text: 'URL Encoding - Coding%20is%20Fun%21',
    options: ['Coding is Fun!', 'Coding%20is%20Fun%21', 'Coding is Fun.', 'Coding% is Fun'],
    correct_answer: 0,
    category: 'Web',
    difficulty: 'easy',
  },
  {
    id: 2,
    question_text: 'Shift each letter backward by 3: FRGLQJ',
    options: ['COFFEE', 'CODING', 'CONCAT', 'CORRECT'],
    correct_answer: 1,
    category: 'Web',
    difficulty: 'easy',
  },
  {
    id: 3,
    question_text: 'What suspicious activity is occurring ? 10:00 LOGIN admin SUCCESS,10:01 LOGIN john FAILED,10:02 LOGIN john FAILED,10:03 LOGIN john FAILED',
    options: ['Possible brute-force attack against john.', 'Dictionary Attacks', 'SQL Injection', 'XSS Attack'],
    correct_answer: 0,
    category: 'JavaScript',
    difficulty: 'medium',
  },
  {
    id: 4,
    question_text: 'Find the business logic bug ? Price = 100 , Discount = 20%, Tax = 10% -- system computes as 100 + 10% - 20%',
    options: ['100 - (tax + 20%)', '(100 - tax) + 20%', '(100 - 20%) + tax', '(100 - tax) + Discount'],
    correct_answer: 2,
    category: 'Web',
    difficulty: 'medium',
  },
  {
    id: 5,
    question_text: 'An example of Infrastructure as a Service',
    options: ['Amazon Lambda', 'Amazon S3', 'Amazon RDS', 'Amazon EC2'],
    correct_answer: 3,
    category: 'Cloud',
    difficulty: 'easy',
  },
  {
    id: 6,
    question_text: 'Which statement about GenAI is correct?',
    options: ['It is always accurate', 'It never requires human review', 'It can generate creative content but may make mistakes', 'It only works offline'],
    correct_answer: 2,
    category: 'genai',
    difficulty: 'easy',
  },
  {
    id: 7,
    question_text: 'primary purpose of an AI agent',
    options: ['Store data permanently', 'Achieve goals by making decisions and taking actions', 'Increase internet speed', 'Manage hardware only'],
    correct_answer: 1,
    category: 'genai',
    difficulty: 'easy',
  },
  {
    id: 8,
    question_text: 'A travel-booking AI can search flights, compare prices, remember user preferences, and make reservations. Which agent capabilities is it using?',
    options: ['Memory only', 'Memory, reasoning, planning, and tool usage', 'Tools only', 'Reflex actions only'],
    correct_answer: 1,
    category: 'genai',
    difficulty: 'easy',
  },
  {
    id: 9,
    question_text: 'Why do programmers prefer dark mode?',
    options: ['Saves electricity', 'Looks cool', 'Bugs are afraid of darkness', 'Light attracts bugs'],
    correct_answer: 2,
    category: 'funny',
    difficulty: 'easy',
  },
  {
    id: 10,
    question_text: 'What is the most object-oriented way to become wealthy?',
    options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'],
    correct_answer: 0,
    category: 'funny',
    difficulty: 'easy',
  },
]

function App() {
  const [page, setPage] = useState<'login' | 'quiz' | 'results' | 'leaderboard' | 'admin'>('login')
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User
        if (!parsed.role || (parsed.role !== 'admin' && parsed.role !== 'player')) {
          localStorage.removeItem('user')
        } else {
          setUser(parsed)
          setPage(parsed.role === 'admin' ? 'leaderboard' : 'quiz')
        }
      } catch {
        localStorage.removeItem('user')
      }
    }
  }, [])

  useEffect(() => {
    async function loadQuestions() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('questions').select('*')
        if (!error && data && data.length > 0) {
          setQuestions(data as Question[])
        } else {
          setQuestions(sampleQuestions)
        }
      } catch {
        setQuestions(sampleQuestions)
      }
      setLoading(false)
    }
    loadQuestions()
  }, [])

  const handleLogin = (u: User) => {
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
    setPage(u.role === 'admin' ? 'leaderboard' : 'quiz')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setScore(0)
    setPage('login')
  }

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore)
    setPage('results')
  }

  const renderPage = () => {
    if (loading && page !== 'login') {
      return <div className="loading">Loading questions...</div>
    }

    switch (page) {
      case 'login':
        return <Login onLogin={handleLogin} />
      case 'quiz':
        return <Quiz questions={questions} onComplete={handleQuizComplete} />
      case 'results':
        return <Results score={score} total={questions.length} user={user} onGoHome={() => setPage('quiz')} onLeaderboard={() => setPage('leaderboard')} />
      case 'leaderboard':
        return user?.role === 'admin' ? <Leaderboard /> : <Login onLogin={handleLogin} />
      case 'admin':
        return <Admin user={user} />
      default:
        return <Login onLogin={handleLogin} />
    }
  }

  return (
    <div className="app-container">
      <Navbar
        user={user}
        currentPage={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
      <main className="main-content">{renderPage()}</main>
    </div>
  )
}

export default App
