import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjycrhzzrqezdaqtpjnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqeWNyaHp6cnFlemRhcXRwam5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTY5MzYsImV4cCI6MjA2MDgzMjkzNn0.bqyqrdUVb4OyDu7R-0hG4aCVARR8H1pom3Mz5heWrTo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
