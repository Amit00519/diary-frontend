import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, GuestRoute } from './components/shared/ProtectedRoute'
import { DiaryLayout } from './components/layout/DiaryLayout'
import { LoginPage }      from './pages/auth/LoginPage'
import { SignupPage }     from './pages/auth/SignupPage'
import { DiaryListPage }  from './pages/diary/DiaryListPage'
import { DiaryFormPage }  from './pages/diary/DiaryFormPage'
import { DiaryDetailPage } from './pages/diary/DiaryDetailPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/diary" replace />} />

            {/* Guest only */}
            <Route element={<GuestRoute />}>
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DiaryLayout />}>
                <Route path="/diary"          element={<DiaryListPage />} />
                <Route path="/diary/new"      element={<DiaryFormPage />} />
                <Route path="/diary/edit/:id" element={<DiaryFormPage />} />
                <Route path="/diary/:id"      element={<DiaryDetailPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/diary" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              background: '#1c1917',
              color: '#faf6f0',
              borderRadius: '10px',
              padding: '12px 18px',
            },
            success: { iconTheme: { primary: '#059669', secondary: '#faf6f0' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#faf6f0' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
