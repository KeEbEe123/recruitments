import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      panels: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          panel_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          panel_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          panel_id?: string | null
          created_at?: string
        }
      }
      metrics: {
        Row: {
          id: string
          name: string
          max_score: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          max_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          max_score?: number
          created_at?: string
        }
      }
      interviews: {
        Row: {
          id: string
          student_id: string
          panel_id: string
          scores: Record<string, number>
          total_score: number
          tier: string
          photo_url: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          student_id: string
          panel_id: string
          scores: Record<string, number>
          total_score: number
          tier: string
          photo_url?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          student_id?: string
          panel_id?: string
          scores?: Record<string, number>
          total_score?: number
          tier?: string
          photo_url?: string | null
          timestamp?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          role: "admin" | "panel_incharge"
          panel_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role: "admin" | "panel_incharge"
          panel_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: "admin" | "panel_incharge"
          panel_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
