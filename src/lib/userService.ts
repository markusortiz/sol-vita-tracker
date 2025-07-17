import { supabase, TABLES, type User } from './supabase'

export class UserService {
  // Get current user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Sign up new user
  static async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
    return data
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLES.users)
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  }

  // Create or update user profile
  static async upsertUserProfile(userId: string, profile: Partial<User>) {
    const { data, error } = await supabase
      .from(TABLES.users)
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update user settings
  static async updateUserSettings(
    userId: string, 
    settings: {
      skin_type?: User['skin_type']
      clothing_coverage?: User['clothing_coverage']
      daily_goal?: number
    }
  ) {
    const { data, error } = await supabase
      .from(TABLES.users)
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Listen to auth changes
  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
} 