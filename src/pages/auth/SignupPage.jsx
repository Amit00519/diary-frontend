import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../../api/auth.api'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Auth.module.css'

function validate(form) {
  const errors = {}
  if (!form.name.trim())  errors.name = 'Name is required'
  if (!form.email)        errors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email'
  if (!form.password)     errors.password = 'Password is required'
  else if (form.password.length < 6) errors.password = 'Minimum 6 characters'
  return errors
}

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const mutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => { login(data); navigate('/diary') },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Signup failed. Please try again.'),
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
          <h1 className={styles.title}>Start your diary</h1>
          <p className={styles.subtitle}>Create a free account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              placeholder="Jane Doe"
              value={form.name} onChange={handleChange}
              className={errors.name ? styles.inputError : ''}
              autoComplete="name"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

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
              placeholder="Minimum 6 characters"
              value={form.password} onChange={handleChange}
              className={errors.password ? styles.inputError : ''}
              autoComplete="new-password"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.btn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
