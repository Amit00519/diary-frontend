import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../../api/auth.api'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Auth.module.css'

function validate(form) {
  const errors = {}
  if (!form.email) errors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email'
  if (!form.password) errors.password = 'Password is required'
  return errors
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => { login(data); navigate('/diary') },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Invalid email or password'),
  })

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (!Object.keys(errs).length) mutation.mutate(form)
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} fade-up`}>
        <div className={styles.header}>
          <span className={styles.logo}>📖</span>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your diary</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              className={errors.email ? styles.inputError : ''}
              autoComplete="email"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange}
              className={errors.password ? styles.inputError : ''}
              autoComplete="current-password"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.btn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footer}>
          No account? <Link to="/signup" className={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
