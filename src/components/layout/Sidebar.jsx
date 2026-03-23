import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { user, logout, initials } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <button className={styles.hamburger} onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className={`${styles.overlay} ${open ? styles.open : ''}`}
        onClick={() => setOpen(false)} />

      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.brand}>
          <span>📖</span>
          <span className={styles.brandName}>MyDiary</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/diary"
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span>📋</span> All Entries
          </NavLink>
          <NavLink
            to="/diary/new"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${styles.navItem} ${styles.navNew} ${isActive ? styles.activeNew : ''}`
            }
          >
            <span>✏️</span> New Entry
          </NavLink>
        </nav>

        <div className={styles.userCard}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  )
}