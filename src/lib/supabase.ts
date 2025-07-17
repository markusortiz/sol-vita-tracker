import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  skin_type: 'very-light' | 'light' | 'medium' | 'dark' | 'very-dark'
  clothing_coverage: 'minimal' | 'partial' | 'full'
  daily_goal: number
  created_at: string
  updated_at: string
}

export interface DailyProgress {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  total_iu: number
  goal_achieved: boolean
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  daily_progress_id: string
  start_time: string
  end_time: string
  duration: number // seconds
  total_iu: number
  uv_index: number
  location_lat: number
  location_lon: number
  created_at: string
}

// Database tables
export const TABLES = {
  users: 'users',
  daily_progress: 'daily_progress',
  sessions: 'sessions'
} as const 