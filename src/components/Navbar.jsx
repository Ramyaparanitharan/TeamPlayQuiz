function Navbar({ user, currentPage, onNavigate, onLogout }) {
  const isAdmin = user?.role === 'admin'

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">Q</span>
        <span className="navbar-title">QuizGame</span>
      </div>

      <div className="navbar-links">
        {user && !isAdmin && (
          <button
            className={`nav-link ${currentPage === 'quiz' ? 'active' : ''}`}
            onClick={() => onNavigate('quiz')}
          >
            Quiz
          </button>
        )}
        {isAdmin && (
          <button
            className={`nav-link ${currentPage === 'leaderboard' ? 'active' : ''}`}
            onClick={() => onNavigate('leaderboard')}
          >
            Leaderboard
          </button>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">{user.name}</span>
            <button className="btn btn-outline" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <span className="navbar-guest">Guest</span>
        )}
      </div>
    </nav>
  )
}

export default Navbar