import { NavLink, Route, Routes } from 'react-router-dom'
import { AboutPage } from '@renderer/routes/AboutPage'
import { HomePage } from '@renderer/routes/HomePage'

function App(): React.JSX.Element {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">electron-vite + react + typescript</p>
          <h1>Electron Dual-Track Starter</h1>
        </div>
        <nav className="nav-tabs">
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} end to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/about">
            About
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<AboutPage />} path="/about" />
        </Routes>
      </main>
    </div>
  )
}

export default App
