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
      contracts: {
        Row: {
          created_at: string | null
          end_date: string | null
          fte: number
          id: string
          salary_gross_cents: number
          start_date: string
          user_id: string
          vacation_hours_non_statutory: number
          vacation_hours_statutory: number
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          fte: number
          id?: string
          salary_gross_cents: number
          start_date: string
          user_id: string
          vacation_hours_non_statutory?: number
          vacation_hours_statutory?: number
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          fte?: number
          id?: string
          salary_gross_cents?: number
          start_date?: string
          user_id?: string
          vacation_hours_non_statutory?: number
          vacation_hours_statutory?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          balance_minutes: number
          created_at: string | null
          expiration_date: string
          id: string
          type: Database["public"]["Enums"]["leave_type"]
          user_id: string
          year: number
        }
        Insert: {
          balance_minutes?: number
          created_at?: string | null
          expiration_date: string
          id?: string
          type: Database["public"]["Enums"]["leave_type"]
          user_id: string
          year: number
        }
        Update: {
          balance_minutes?: number
          created_at?: string | null
          expiration_date?: string
          id?: string
          type?: Database["public"]["Enums"]["leave_type"]
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          minutes_requested: number
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          minutes_requested: number
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          minutes_requested?: number
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          is_owner: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          email: string
          full_name?: string | null
          id: string
          is_owner?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_owner?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sickness_logs: {
        Row: {
          created_at: string | null
          id: string
          recovery_date: string | null
          report_date: string
          status: Database["public"]["Enums"]["sickness_status"]
          updated_at: string | null
          user_id: string
          uwv_notification_sent: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recovery_date?: string | null
          report_date: string
          status?: Database["public"]["Enums"]["sickness_status"]
          updated_at?: string | null
          user_id: string
          uwv_notification_sent?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recovery_date?: string | null
          report_date?: string
          status?: Database["public"]["Enums"]["sickness_status"]
          updated_at?: string | null
          user_id?: string
          uwv_notification_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "sickness_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wkr_expenses: {
        Row: {
          amount_cents: number
          category: Database["public"]["Enums"]["wkr_category"]
          created_at: string | null
          date: string
          description: string
          id: string
        }
        Insert: {
          amount_cents: number
          category: Database["public"]["Enums"]["wkr_category"]
          created_at?: string | null
          date?: string
          description: string
          id?: string
        }
        Update: {
          amount_cents?: number
          category?: Database["public"]["Enums"]["wkr_category"]
          created_at?: string | null
          date?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      leave_status: "pending" | "approved" | "denied"
      leave_type: "wettelijk" | "bovenwettelijk"
      sickness_status:
        | "reported"
        | "problem_analysis"
        | "plan_of_approach"
        | "42_week_notification"
        | "first_year_evaluation"
        | "wia_application_prep"
        | "final_evaluation"
        | "wia_dossier"
        | "recovered"
      user_role: "super_admin" | "hr_admin" | "manager" | "employee"
      wkr_category: "taxable" | "targeted_exemption"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}