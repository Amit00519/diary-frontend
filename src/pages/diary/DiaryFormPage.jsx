import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { diaryApi } from '../../api/diary.api'
import { MOOD_META, MOODS } from '../../constants'
import { Spinner } from '../../components/shared/Spinner'
import styles from './DiaryForm.module.css'

function validate(form) {
  const errors = {}
  if (!form.title.trim())   errors.title   = 'Title is required'
  if (!form.content.trim()) errors.content = 'Content is required'
  return errors
}

export function DiaryFormPage() {
  const { id }     = useParams()
  const isEdit     = !!id
  const navigate   = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm]     = useState({ title: '', content: '', mood: 'NEUTRAL' })
  const [errors, setErrors] = useState({})

  const { data: existing, isLoading: loadingEntry } = useQuery({
    queryKey: ['entry', id],
    queryFn:  () => diaryApi.getOne(Number(id)),
    enabled:  isEdit,
  })

  useEffect(() => {
    if (existing) {
      setForm({ title: existing.title, content: existing.content, mood: existing.mood })
    }
  }, [existing])

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? diaryApi.update(Number(id), data) : diaryApi.create(data),
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['entry', id] })
      toast.success(isEdit ? 'Entry updated!' : 'Entry saved!')
      navigate(`/diary/${entry.id}`)
    },
    onError: () => toast.error('Failed to save. Please try again.'),
  })

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (!Object.keys(errs).length) mutation.mutate(form)
  }

  if (isEdit && loadingEntry) return <Spinner text="Loading entry…" />

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to={isEdit ? `/diary/${id}` : '/diary'} className={styles.back}>← Back</Link>
        <h1 className={styles.pageTitle}>{isEdit ? 'Edit Entry' : 'New Entry'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>

        {/* Title */}
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title" type="text"
            placeholder="What's this memory about?"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={errors.title ? styles.inputError : ''}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        {/* Mood picker */}
        <div className={styles.field}>
          <label>How are you feeling?</label>
          <div className={styles.moodGrid}>
            {MOODS.map((mood) => (
              <button
                key={mood} type="button"
                className={`${styles.moodBtn} ${form.mood === mood ? styles.moodSelected : ''}`}
                style={form.mood === mood
                  ? { borderColor: MOOD_META[mood].color, background: MOOD_META[mood].bg }
                  : {}}
                onClick={() => setForm((f) => ({ ...f, mood }))}
                title={MOOD_META[mood].label}
              >
                <span className={styles.moodEmoji}>{MOOD_META[mood].emoji}</span>
                <span className={styles.moodLabel}>{MOOD_META[mood].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={styles.field}>
          <label htmlFor="content">Your thoughts</label>
          <textarea
            id="content" rows={14}
            placeholder="Write freely — this is just for you…"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className={errors.content ? styles.inputError : ''}
          />
          {errors.content && <span className={styles.error}>{errors.content}</span>}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to={isEdit ? `/diary/${id}` : '/diary'} className={styles.cancelBtn}>Cancel</Link>
          <button type="submit" className={styles.saveBtn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : isEdit ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>

      </form>
    </div>
  )
}
