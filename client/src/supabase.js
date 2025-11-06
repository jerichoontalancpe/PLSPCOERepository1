import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iyviaeurlpskiohnzcyy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmlhZXVybHBza2lvaG56Y3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDU3MjYsImV4cCI6MjA3Nzk4MTcyNn0.f-czORwogj75zRpdfpvWp4DNKQKeN33npU5lKqedfY8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
