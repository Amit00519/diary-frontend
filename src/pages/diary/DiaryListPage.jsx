import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { diaryApi } from '../../api/diary.api'
import { MOOD_META, MOODS } from '../../constants'
import { MoodBadge } from '../../components/shared/MoodBadge'
import { Spinner } from '../../components/shared/Spinner'
import styles from './DiaryList.module.css'

function formatDate(iso) {
  return new Date(iso + 'Z').toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

export function DiaryListPage() {
  const [keyword, setKeyword]         = useState('')
  const [selectedMood, setSelectedMood] = useState(null)

  const { data: entries = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['entries'],
    queryFn: diaryApi.getAll,
  })

  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase().trim()
    return entries.filter((e) => {
      const matchesMood    = !selectedMood || e.mood === selectedMood
      const matchesKeyword = !kw || e.title.toLowerCase().includes(kw) || e.content.toLowerCase().includes(kw)
      return matchesMood && matchesKeyword
    })
  }, [entries, keyword, selectedMood])

  function toggleMood(mood) {
    setSelectedMood((m) => (m === mood ? null : mood))
  }

  function clearAll() {
    setKeyword('')
    setSelectedMood(null)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Memories</h1>
          <p className={styles.count}>{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}</p>
        </div>
        <Link to="/diary/new" className={styles.newBtn}>+ New Entry</Link>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search entries…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button className={styles.clearSearch} onClick={() => setKeyword('')}>✕</button>
        )}
      </div>

      {/* Mood filters */}
      <div className={styles.moodFilters}>
        {MOODS.map((mood) => (
          <button
            key={mood}
            className={`${styles.chip} ${selectedMood === mood ? styles.chipActive : ''}`}
            style={selectedMood === mood
              ? { background: MOOD_META[mood].bg, color: MOOD_META[mood].color, borderColor: MOOD_META[mood].color }
              : {}}
            onClick={() => toggleMood(mood)}
          >
            {MOOD_META[mood].emoji} {MOOD_META[mood].label}
          </button>
        ))}
        {(selectedMood || keyword) && (
          <button className={`${styles.chip} ${styles.chipClear}`} onClick={clearAll}>
            ✕ Clear all
          </button>
        )}
      </div>

      {/* States */}
      {isLoading && <Spinner text="Loading your memories…" />}

      {isError && (
        <div className={styles.stateBox}>
          <p>⚠️ Failed to load entries.</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          {keyword || selectedMood ? (
            <p>No entries match your filters.{' '}
              <button className={styles.linkBtn} onClick={clearAll}>Clear filters</button>
            </p>
          ) : (
            <p>No entries yet.{' '}
              <Link to="/diary/new" className={styles.linkBtn}>Write your first memory</Link>
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((entry, i) => (
            <Link
              key={entry.id}
              to={`/diary/${entry.id}`}
              className={styles.card}
              style={{ borderLeftColor: MOOD_META[entry.mood].color, animationDelay: `${i * 0.05}s` }}
            >
              <div className={styles.cardTop}>
                <MoodBadge mood={entry.mood} size="sm" />
                <span className={styles.cardDate}>{formatDate(entry.createdAt)}</span>
              </div>
              <h3 className={styles.cardTitle}>{entry.title}</h3>
              <p className={styles.cardPreview}>
                {entry.content.length > 130 ? entry.content.slice(0, 130) + '…' : entry.content}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
