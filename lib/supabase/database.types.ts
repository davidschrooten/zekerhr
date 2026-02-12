export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
        }
        Relationships: []
      }
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
      documents: {
        Row: {
          created_at: string | null
          id: string
          name: string
          path: string
          size_bytes: number | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          path: string
          size_bytes?: number | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          path?: string
          size_bytes?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_claims: {
        Row: {
          amount_cents: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          currency: string | null
          date: string
          description: string
          id: string
          receipt_url: string | null
          status: Database["public"]["Enums"]["expense_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          currency?: string | null
          date?: string
          description: string
          id?: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          currency?: string | null
          date?: string
          description?: string
          id?: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_claims_user_id_fkey"
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
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
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
      sensitive_data: {
        Row: {
          bsn_encrypted: string | null
          created_at: string | null
          iban_encrypted: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bsn_encrypted?: string | null
          created_at?: string | null
          iban_encrypted?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bsn_encrypted?: string | null
          created_at?: string | null
          iban_encrypted?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sensitive_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sickness_logs: {
        Row: {
          created_at: string | null
          documents: Json | null
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
          documents?: Json | null
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
          documents?: Json | null
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
      check_compliance_deadlines: { Args: never; Returns: undefined }
      reveal_sensitive_data: {
        Args: { target_user_id: string }
        Returns: {
          bsn: string
          iban: string
        }[]
      }
      store_sensitive_data: {
        Args: { plain_bsn: string; plain_iban: string; target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      audit_action:
        | "LOGIN"
        | "LOGOUT"
        | "VIEW_BSN"
        | "VIEW_SICKNESS_DETAILS"
        | "EXPORT_PAYROLL"
        | "APPROVE_LEAVE"
        | "DENY_LEAVE"
        | "REPORT_SICKNESS"
        | "REPORT_RECOVERY"
        | "UPDATE_ROLE"
        | "CREATE_USER"
        | "ADD_EXPENSE"
      expense_category: "travel" | "equipment" | "meals" | "training" | "other"
      expense_status: "pending" | "approved" | "rejected" | "paid"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      audit_action: [
        "LOGIN",
        "LOGOUT",
        "VIEW_BSN",
        "VIEW_SICKNESS_DETAILS",
        "EXPORT_PAYROLL",
        "APPROVE_LEAVE",
        "DENY_LEAVE",
        "REPORT_SICKNESS",
        "REPORT_RECOVERY",
        "UPDATE_ROLE",
        "CREATE_USER",
        "ADD_EXPENSE",
      ],
      expense_category: ["travel", "equipment", "meals", "training", "other"],
      expense_status: ["pending", "approved", "rejected", "paid"],
      leave_status: ["pending", "approved", "denied"],
      leave_type: ["wettelijk", "bovenwettelijk"],
      sickness_status: [
        "reported",
        "problem_analysis",
        "plan_of_approach",
        "42_week_notification",
        "first_year_evaluation",
        "wia_application_prep",
        "final_evaluation",
        "wia_dossier",
        "recovered",
      ],
      user_role: ["super_admin", "hr_admin", "manager", "employee"],
      wkr_category: ["taxable", "targeted_exemption"],
    },
  },
} as const
