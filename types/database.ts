export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'premium'
          plan_expires_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'premium'
          plan_expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'premium'
          plan_expires_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          id: string
          name: string
          slug: string
          category: 'CPNS' | 'BI' | 'OJK' | 'ASTRA' | 'LAINNYA'
          description: string | null
          duration_minutes: number
          total_questions: number
          is_free: boolean
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category: 'CPNS' | 'BI' | 'OJK' | 'ASTRA' | 'LAINNYA'
          description?: string | null
          duration_minutes?: number
          total_questions: number
          is_free?: boolean
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: 'CPNS' | 'UTBK' | 'KEDINASAN' | 'LAINNYA'
          description?: string | null
          duration_minutes?: number
          total_questions?: number
          is_free?: boolean
          is_published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          package_id: string
          content: string
          options: Json
          correct_answer: string
          explanation: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          category: string | null
          image_url: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          content: string
          options: Json
          correct_answer: string
          explanation?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string | null
          image_url?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          content?: string
          options?: Json
          correct_answer?: string
          explanation?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string | null
          image_url?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'questions_package_id_fkey'
            columns: ['package_id']
            isOneToOne: false
            referencedRelation: 'packages'
            referencedColumns: ['id']
          }
        ]
      }
      attempts: {
        Row: {
          id: string
          user_id: string
          package_id: string
          answers: Json
          score: number | null
          correct_count: number | null
          wrong_count: number | null
          empty_count: number | null
          duration_seconds: number | null
          status: 'ongoing' | 'finished'
          started_at: string
          finished_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          package_id: string
          answers?: Json
          score?: number | null
          correct_count?: number | null
          wrong_count?: number | null
          empty_count?: number | null
          duration_seconds?: number | null
          status?: 'ongoing' | 'finished'
          started_at?: string
          finished_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          package_id?: string
          answers?: Json
          score?: number | null
          correct_count?: number | null
          wrong_count?: number | null
          empty_count?: number | null
          duration_seconds?: number | null
          status?: 'ongoing' | 'finished'
          started_at?: string
          finished_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'attempts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'attempts_package_id_fkey'
            columns: ['package_id']
            isOneToOne: false
            referencedRelation: 'packages'
            referencedColumns: ['id']
          }
        ]
      }
      questions_tkp: {
        Row: {
          id: string
          package_id: string
          content: string
          opt_a: string
          opt_b: string
          opt_c: string
          opt_d: string
          opt_e: string
          point_a: number
          point_b: number
          point_c: number
          point_d: number
          point_e: number
          explanation: string | null
          image_url: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          content: string
          opt_a: string
          opt_b: string
          opt_c: string
          opt_d: string
          opt_e: string
          point_a: number
          point_b: number
          point_c: number
          point_d: number
          point_e: number
          explanation?: string | null
          image_url?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          content?: string
          opt_a?: string
          opt_b?: string
          opt_c?: string
          opt_d?: string
          opt_e?: string
          point_a?: number
          point_b?: number
          point_c?: number
          point_d?: number
          point_e?: number
          explanation?: string | null
          image_url?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'questions_tkp_package_id_fkey'
            columns: ['package_id']
            isOneToOne: false
            referencedRelation: 'packages'
            referencedColumns: ['id']
          }
        ]
      }
      questions_astra_wm: {
        Row: {
          id: string
          package_id: string
          memory_pairs: Json
          memory_duration_seconds: number
          recall_questions: Json
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          memory_pairs: Json
          memory_duration_seconds?: number
          recall_questions: Json
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          memory_pairs?: Json
          memory_duration_seconds?: number
          recall_questions?: Json
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'questions_astra_wm_package_id_fkey'
            columns: ['package_id']
            isOneToOne: false
            referencedRelation: 'packages'
            referencedColumns: ['id']
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          midtrans_order_id: string
          midtrans_transaction_id: string | null
          plan_type: 'monthly' | 'yearly'
          amount: number
          status: 'pending' | 'paid' | 'failed' | 'expired'
          paid_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          midtrans_order_id: string
          midtrans_transaction_id?: string | null
          plan_type: 'monthly' | 'yearly'
          amount: number
          status?: 'pending' | 'paid' | 'failed' | 'expired'
          paid_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          midtrans_order_id?: string
          midtrans_transaction_id?: string | null
          plan_type?: 'monthly' | 'yearly'
          amount?: number
          status?: 'pending' | 'paid' | 'failed' | 'expired'
          paid_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
