# 🚀 Supabase Backend Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a name (e.g., "solarin-app")
4. Set a database password
5. Choose a region close to your users

## 2. Get Your Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **Project URL** and **anon public** key
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Database Schema Setup

Run these SQL commands in your Supabase **SQL Editor**:

### Create Users Table
```sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  skin_type TEXT DEFAULT 'light' CHECK (skin_type IN ('very-light', 'light', 'medium', 'dark', 'very-dark')),
  clothing_coverage TEXT DEFAULT 'minimal' CHECK (clothing_coverage IN ('minimal', 'partial', 'full')),
  daily_goal INTEGER DEFAULT 700,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Create Daily Progress Table
```sql
-- Create daily_progress table
CREATE TABLE public.daily_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_iu INTEGER DEFAULT 0,
  goal_achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own daily progress" ON public.daily_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily progress" ON public.daily_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily progress" ON public.daily_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

### Create Sessions Table
```sql
-- Create sessions table
CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_progress_id UUID REFERENCES public.daily_progress(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  total_iu INTEGER NOT NULL,
  uv_index DECIMAL(3,2) NOT NULL,
  location_lat DECIMAL(10,8) NOT NULL,
  location_lon DECIMAL(11,8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.daily_progress dp 
      WHERE dp.id = sessions.daily_progress_id 
      AND dp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.daily_progress dp 
      WHERE dp.id = sessions.daily_progress_id 
      AND dp.user_id = auth.uid()
    )
  );
```

### Create Indexes for Performance
```sql
-- Create indexes for better performance
CREATE INDEX idx_daily_progress_user_date ON public.daily_progress(user_id, date);
CREATE INDEX idx_sessions_daily_progress_id ON public.sessions(daily_progress_id);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at);
```

## 4. Authentication Setup

1. Go to **Authentication** → **Settings** in Supabase
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add redirect URLs:
   - `http://localhost:5173/**`
   - `http://localhost:8081/**`
   - Your production URL when ready

## 5. Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the confirmation and recovery email templates
3. Add your app branding and messaging

## 6. Test Your Setup

1. Start your development server: `npm run dev`
2. Try to sign up with a new account
3. Check the **Authentication** → **Users** section in Supabase
4. Verify that user profiles are created in the **users** table

## 7. Production Deployment

When deploying to production:

1. Update your environment variables with production Supabase credentials
2. Add your production domain to Supabase redirect URLs
3. Configure any additional security policies as needed

## 8. Database Functions (Optional)

You can add these helpful database functions:

```sql
-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 9. Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Make sure your `.env` file exists and has the correct variables
   - Restart your development server after adding environment variables

2. **"Row Level Security" errors**
   - Check that RLS policies are correctly set up
   - Verify user authentication is working

3. **"Foreign key constraint" errors**
   - Ensure tables are created in the correct order
   - Check that referenced IDs exist

4. **Authentication not working**
   - Verify redirect URLs are correctly configured
   - Check that email confirmation is enabled/disabled as needed

## 10. Next Steps

After setup:
1. Test user registration and login
2. Verify daily progress tracking works
3. Test session creation and retrieval
4. Implement any additional features you need

Your Solarin app now has a complete backend with:
- ✅ User authentication
- ✅ Profile management
- ✅ Daily progress tracking
- ✅ Session history
- ✅ Automatic daily resets
- ✅ Data persistence 