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
      quiz_question_options: {
        Row: {
          id: string
          label: string
          question_id: string | null
          value: string
        }
        Insert: {
          id?: string
          label: string
          question_id?: string | null
          value: string
        }
        Update: {
          id?: string
          label?: string
          question_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string | null
          description: string | null
          field_name: string
          id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          field_name: string
          id?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          field_name?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      therapist_availability: {
        Row: {
          availability: string
          id: string
          therapist_id: string | null
        }
        Insert: {
          availability: string
          id?: string
          therapist_id?: string | null
        }
        Update: {
          availability?: string
          id?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_availability_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_client_types: {
        Row: {
          client_type: string
          id: string
          therapist_id: string | null
        }
        Insert: {
          client_type: string
          id?: string
          therapist_id?: string | null
        }
        Update: {
          client_type?: string
          id?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_client_types_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_languages: {
        Row: {
          id: string
          language: string
          therapist_id: string | null
        }
        Insert: {
          id?: string
          language: string
          therapist_id?: string | null
        }
        Update: {
          id?: string
          language?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_languages_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_modalities: {
        Row: {
          id: string
          modality: string
          therapist_id: string | null
        }
        Insert: {
          id?: string
          modality: string
          therapist_id?: string | null
        }
        Update: {
          id?: string
          modality?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_modalities_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_session_types: {
        Row: {
          id: string
          session_type: string
          therapist_id: string | null
        }
        Insert: {
          id?: string
          session_type: string
          therapist_id?: string | null
        }
        Update: {
          id?: string
          session_type?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_session_types_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_specialties: {
        Row: {
          specialty: string
          specialty_addiction: string
          therapist_id: string | null
        }
        Insert: {
          specialty: string
          specialty_addiction?: string
          therapist_id?: string | null
        }
        Update: {
          specialty?: string
          specialty_addiction?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_specialties_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          bio: string | null
          booking_link: string | null
          created_at: string | null
          custom_message: string | null
          designation: string | null
          extended_bio: string | null
          gender: string | null
          id: string
          intro_video_url: string | null
          name: string
          photo: string | null
          pronouns: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          booking_link?: string | null
          created_at?: string | null
          custom_message?: string | null
          designation?: string | null
          extended_bio?: string | null
          gender?: string | null
          id?: string
          intro_video_url?: string | null
          name: string
          photo?: string | null
          pronouns?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          booking_link?: string | null
          created_at?: string | null
          custom_message?: string | null
          designation?: string | null
          extended_bio?: string | null
          gender?: string | null
          id?: string
          intro_video_url?: string | null
          name?: string
          photo?: string | null
          pronouns?: string | null
          updated_at?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
