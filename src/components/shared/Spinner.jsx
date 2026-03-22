import styles from './Spinner.module.css'

export function Spinner({ text = 'Loading…' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  )
}
