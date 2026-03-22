import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import styles from './DiaryLayout.module.css'

export function DiaryLayout() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
