import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { UserService } from '@/lib/userService'
import { type User as UserProfile } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await UserService.getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          const userProfile = await UserService.getUserProfile(currentUser.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Listen for auth changes
    const { data: { subscription } } = UserService.onAuthStateChange(async (user) => {
      setUser(user)
      
      if (user) {
        try {
          const userProfile = await UserService.getUserProfile(user.id)
          setProfile(userProfile)
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await UserService.signIn(email, password)
      toast({
        title: "Login successful",
        description: "Welcome back to Solarin!",
      })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await UserService.signUp(email, password, name)
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      })
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      await UserService.signOut()
      toast({
        title: "Signed out",
        description: "Come back soon for more vitamin D!",
      })
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const updatedProfile = await UserService.upsertUserProfile(user.id, updates)
      setProfile(updatedProfile)
      toast({
        title: "Profile updated",
        description: "Your settings have been saved.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 