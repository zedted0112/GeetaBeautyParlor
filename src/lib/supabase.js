import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://virnmgiiaqqphocqrrui.supabase.co'
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcm5tZ2lpYXFxcGhvY3FycnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTkxOTYsImV4cCI6MjEwNTQ3NTE5Nn0.W1EUuMQvAVBXVmwAGokQtP7eeYJPyUMyzwNGmfYGcgQ'

export const supabase = createClient(url, anonKey)
