import { supabase, TABLES, type DailyProgress, type Session } from './supabase'

export class ProgressService {
  // Get today's date in YYYY-MM-DD format
  static getTodayDate(): string {
    return new Date().toISOString().split('T')[0]
  }

  // Get daily progress for a user
  static async getDailyProgress(userId: string, date?: string): Promise<DailyProgress | null> {
    const targetDate = date || this.getTodayDate()
    
    const { data, error } = await supabase
      .from(TABLES.daily_progress)
      .select('*')
      .eq('user_id', userId)
      .eq('date', targetDate)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create or get daily progress (auto-creates if doesn't exist)
  static async getOrCreateDailyProgress(userId: string, date?: string): Promise<DailyProgress> {
    const targetDate = date || this.getTodayDate()
    
    // Try to get existing progress
    let progress = await this.getDailyProgress(userId, targetDate)
    
    // If no progress exists for today, create it
    if (!progress) {
      const { data, error } = await supabase
        .from(TABLES.daily_progress)
        .insert({
          user_id: userId,
          date: targetDate,
          total_iu: 0,
          goal_achieved: false
        })
        .select()
        .single()
      
      if (error) throw error
      progress = data
    }
    
    return progress
  }

  // Update daily progress
  static async updateDailyProgress(
    progressId: string, 
    updates: { total_iu?: number; goal_achieved?: boolean }
  ): Promise<DailyProgress> {
    const { data, error } = await supabase
      .from(TABLES.daily_progress)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', progressId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Add IU to daily progress
  static async addIUToDailyProgress(userId: string, iuToAdd: number): Promise<DailyProgress> {
    const progress = await this.getOrCreateDailyProgress(userId)
    const newTotalIU = progress.total_iu + iuToAdd
    
    // Check if goal is achieved (assuming 700 IU is the default goal)
    const goalAchieved = newTotalIU >= 700
    
    return await this.updateDailyProgress(progress.id, {
      total_iu: newTotalIU,
      goal_achieved: goalAchieved
    })
  }

  // Create a new session
  static async createSession(
    dailyProgressId: string,
    sessionData: {
      start_time: string
      end_time: string
      duration: number
      total_iu: number
      uv_index: number
      location_lat: number
      location_lon: number
    }
  ): Promise<Session> {
    const { data, error } = await supabase
      .from(TABLES.sessions)
      .insert({
        daily_progress_id: dailyProgressId,
        ...sessionData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Get sessions for a specific day
  static async getSessionsForDay(dailyProgressId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from(TABLES.sessions)
      .select('*')
      .eq('daily_progress_id', dailyProgressId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  // Get user's progress history
  static async getProgressHistory(userId: string, days: number = 7): Promise<DailyProgress[]> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from(TABLES.daily_progress)
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Check if it's a new day and reset progress if needed
  static async checkAndResetDailyProgress(userId: string): Promise<DailyProgress> {
    const today = this.getTodayDate()
    const progress = await this.getDailyProgress(userId, today)
    
    if (!progress) {
      // It's a new day, create fresh progress
      return await this.getOrCreateDailyProgress(userId, today)
    }
    
    return progress
  }

  // Get weekly statistics
  static async getWeeklyStats(userId: string): Promise<{
    totalIU: number
    averageDaily: number
    daysWithProgress: number
    goalAchievedDays: number
  }> {
    const history = await this.getProgressHistory(userId, 7)
    
    const totalIU = history.reduce((sum, day) => sum + day.total_iu, 0)
    const averageDaily = history.length > 0 ? totalIU / history.length : 0
    const daysWithProgress = history.filter(day => day.total_iu > 0).length
    const goalAchievedDays = history.filter(day => day.goal_achieved).length
    
    return {
      totalIU,
      averageDaily,
      daysWithProgress,
      goalAchievedDays
    }
  }
} 