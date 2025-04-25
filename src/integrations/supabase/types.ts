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
      job_import_configs: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          parameters: Json
          source_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          parameters?: Json
          source_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          parameters?: Json
          source_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_import_configs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "job_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      job_imports: {
        Row: {
          completed_at: string | null
          config_id: string | null
          created_by: string | null
          errors: Json | null
          id: string
          jobs_imported: number | null
          jobs_processed: number | null
          metadata: Json | null
          source: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          config_id?: string | null
          created_by?: string | null
          errors?: Json | null
          id?: string
          jobs_imported?: number | null
          jobs_processed?: number | null
          metadata?: Json | null
          source: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          config_id?: string | null
          created_by?: string | null
          errors?: Json | null
          id?: string
          jobs_imported?: number | null
          jobs_processed?: number | null
          metadata?: Json | null
          source?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_imports_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "job_import_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_sources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          ai_benefits: string | null
          ai_experience_level: string | null
          ai_key_skills: string | null
          ai_salary_data: Json | null
          ai_work_arrangement: string | null
          api_job_id: string | null
          api_source: string | null
          category: string | null
          company_followers: number | null
          company_headquarters: string | null
          company_id: string
          company_industry: string | null
          company_size: string | null
          description: string
          id: string
          import_id: string | null
          is_approved: boolean
          is_featured: boolean
          location: string | null
          posted_by: string
          posted_date: string
          recruiter_name: string | null
          recruiter_title: string | null
          recruiter_url: string | null
          salary: string | null
          source_id: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          type: Database["public"]["Enums"]["job_type"]
          updated_at: string
          url: string | null
        }
        Insert: {
          ai_benefits?: string | null
          ai_experience_level?: string | null
          ai_key_skills?: string | null
          ai_salary_data?: Json | null
          ai_work_arrangement?: string | null
          api_job_id?: string | null
          api_source?: string | null
          category?: string | null
          company_followers?: number | null
          company_headquarters?: string | null
          company_id: string
          company_industry?: string | null
          company_size?: string | null
          description: string
          id?: string
          import_id?: string | null
          is_approved?: boolean
          is_featured?: boolean
          location?: string | null
          posted_by: string
          posted_date?: string
          recruiter_name?: string | null
          recruiter_title?: string | null
          recruiter_url?: string | null
          salary?: string | null
          source_id?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          url?: string | null
        }
        Update: {
          ai_benefits?: string | null
          ai_experience_level?: string | null
          ai_key_skills?: string | null
          ai_salary_data?: Json | null
          ai_work_arrangement?: string | null
          api_job_id?: string | null
          api_source?: string | null
          category?: string | null
          company_followers?: number | null
          company_headquarters?: string | null
          company_id?: string
          company_industry?: string | null
          company_size?: string | null
          description?: string
          id?: string
          import_id?: string | null
          is_approved?: boolean
          is_featured?: boolean
          location?: string | null
          posted_by?: string
          posted_date?: string
          recruiter_name?: string | null
          recruiter_title?: string | null
          recruiter_url?: string | null
          salary?: string | null
          source_id?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "job_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "job_sources"
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
    Enums: {
      job_status: ["active", "inactive", "archived"],
      job_type: ["full-time", "part-time", "contract", "remote", "internship"],
      user_role: ["owner", "company", "candidate"],
    },
  },
} as const
