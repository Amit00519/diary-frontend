export const MOOD_META = {
  HAPPY:    { label: 'Happy',    emoji: '😊', color: '#d97706', bg: '#fef3c7' },
  SAD:      { label: 'Sad',      emoji: '😢', color: '#4f46e5', bg: '#ede9fe' },
  NEUTRAL:  { label: 'Neutral',  emoji: '😐', color: '#6b7280', bg: '#f3f4f6' },
  EXCITED:  { label: 'Excited',  emoji: '🎉', color: '#db2777', bg: '#fce7f3' },
  ANXIOUS:  { label: 'Anxious',  emoji: '😰', color: '#ea580c', bg: '#ffedd5' },
  GRATEFUL: { label: 'Grateful', emoji: '🙏', color: '#059669', bg: '#d1fae5' },
  ANGRY:    { label: 'Angry',    emoji: '😡', color: '#dc2626', bg: '#fee2e2' },
}

export const MOODS = Object.keys(MOOD_META)

// export const API_BASE_URL = 'http://localhost:8080/api'
//Change the below for deployement
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const STORAGE_KEY  = 'diary_auth'
