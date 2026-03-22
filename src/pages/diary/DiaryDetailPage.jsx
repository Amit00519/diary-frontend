import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { diaryApi } from '../../api/diary.api'
import { MOOD_META } from '../../constants'
import { MoodBadge } from '../../components/shared/MoodBadge'
import { Spinner } from '../../components/shared/Spinner'
import styles from './DiaryDetail.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function DiaryDetailPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const queryClient = useQueryClient()

  const { data: entry, isLoading, isError } = useQuery({
    queryKey: ['entry', id],
    queryFn:  () => diaryApi.getOne(Number(id)),
    enabled:  !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => diaryApi.remove(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      toast.success('Entry deleted')
      navigate('/diary')
    },
    onError: () => toast.error('Failed to delete entry.'),
  })

  function handleDelete() {
    if (window.confirm('Delete this entry? This cannot be undone.')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) return <Spinner text="Loading entry…" />

  if (isError || !entry) {
    return (
      <div className={styles.errorState}>
        <p>Entry not found.</p>
        <Link to="/diary">← Back to all entries</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <Link to="/diary" className={styles.back}>← All Entries</Link>
        <div className={styles.actions}>
          <Link to={`/diary/edit/${entry.id}`} className={styles.editBtn}>✏️ Edit</Link>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            🗑️ {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Entry */}
      <article className={styles.entry} style={{ borderTopColor: MOOD_META[entry.mood]?.color }}>
        <div className={styles.meta}>
          <MoodBadge mood={entry.mood} />
          <div className={styles.dates}>
            <span>{formatDate(entry.createdAt)}</span>
            <span className={styles.dot}>·</span>
            <span>{formatTime(entry.createdAt)}</span>
            {entry.updatedAt !== entry.createdAt && (
              <span className={styles.edited}>(edited)</span>
            )}
          </div>
        </div>

        <h1 className={styles.entryTitle}>{entry.title}</h1>
        <hr className={styles.divider} />
        <div className={styles.content}>{entry.content}</div>
      </article>
    </div>
  )
}
