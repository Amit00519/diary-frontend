import { MOOD_META } from '../../constants'
import styles from './MoodBadge.module.css'

export function MoodBadge({ mood, size = 'md' }) {
  const meta = MOOD_META[mood]
  if (!meta) return null
  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={{ background: meta.bg, color: meta.color }}
    >
      {meta.emoji} {meta.label}
    </span>
  )
}
