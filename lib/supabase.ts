import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = 'https://goymyoyfqoyaotjmdpcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveW15b3lmcW95YW90am1kcGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTk1NDYsImV4cCI6MjA4MjY3NTU0Nn0.v2lKOdJ6cRvWACs_BA2rkoN_TLxP6YUxjlAAvnN7QNA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Google Client ID
export const GOOGLE_WEB_CLIENT_ID = '53582437288-9vpg19hil10c0iu7kitgp4ql3ahqjr9a.apps.googleusercontent.com';
export const GOOGLE_ANDROID_CLIENT_ID = '53582437288-s3dkm2hufejo0b45mbgbl0gl912v4elj.apps.googleusercontent.com';

// Types
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
}
