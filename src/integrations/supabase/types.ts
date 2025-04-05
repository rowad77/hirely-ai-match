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
      applications: {
        Row: {
          candidate_id: string
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          resume_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_benefits: string[] | null
          company_culture: string | null
          company_size: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          hiring_process: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          size: string | null
          social_links: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_benefits?: string[] | null
          company_culture?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          hiring_process?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          size?: string | null
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_benefits?: string[] | null
          company_culture?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          hiring_process?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          size?: string | null
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          is_current: boolean | null
          profile_id: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          is_current?: boolean | null
          profile_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          is_current?: boolean | null
          profile_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string | null
          created_at: string | null
          feedback: Json | null
          id: string
          interview_date: string | null
          interview_type: string | null
          interviewer_id: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          interview_date?: string | null
          interview_type?: string | null
          interviewer_id?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          interview_date?: string | null
          interview_type?: string | null
          interviewer_id?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          category: string | null
          company_id: string
          description: string
          id: string
          is_approved: boolean
          is_featured: boolean
          location: string | null
          posted_by: string
          posted_date: string
          salary: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          type: Database["public"]["Enums"]["job_type"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          company_id: string
          description: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          location?: string | null
          posted_by: string
          posted_date?: string
          salary?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          company_id?: string
          description?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          location?: string | null
          posted_by?: string
          posted_date?: string
          salary?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          proficiency_level: string | null
          profile_id: string
          skill_id: string
          years_experience: number | null
        }
        Insert: {
          proficiency_level?: string | null
          profile_id: string
          skill_id: string
          years_experience?: number | null
        }
        Update: {
          proficiency_level?: string | null
          profile_id?: string
          skill_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          company_id: string | null
          created_at: string
          desired_salary: string | null
          education: string[] | null
          email: string
          experience_years: number | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_active: string | null
          phone_text: string | null
          preferred_job_types: string[] | null
          resume_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          desired_salary?: string | null
          education?: string[] | null
          email: string
          experience_years?: number | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_active?: string | null
          phone_text?: string | null
          preferred_job_types?: string[] | null
          resume_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          desired_salary?: string | null
          education?: string[] | null
          email?: string
          experience_years?: number | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_active?: string | null
          phone_text?: string | null
          preferred_job_types?: string[] | null
          resume_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          notes: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string | null
          search_name: string | null
          search_params: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          search_name?: string | null
          search_params?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          search_name?: string | null
          search_params?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      work_experiences: {
        Row: {
          company_name: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          job_title: string
          profile_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          job_title: string
          profile_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          job_title?: string
          profile_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      track_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_activity_data: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      job_status: "active" | "inactive" | "archived"
      job_type: "full-time" | "part-time" | "contract" | "remote" | "internship"
      user_role: "owner" | "company" | "candidate"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
