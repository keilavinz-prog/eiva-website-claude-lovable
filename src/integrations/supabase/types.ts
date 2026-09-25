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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          assigned_to: string | null
          calendar_event_id: string | null
          client_id: string | null
          created_at: string
          email: string
          id: string
          meet_link: string | null
          meeting_type: string
          name: string
          phone: string | null
          preferred_date: string
          preferred_time: string
          service_id: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          calendar_event_id?: string | null
          client_id?: string | null
          created_at?: string
          email: string
          id?: string
          meet_link?: string | null
          meeting_type?: string
          name: string
          phone?: string | null
          preferred_date: string
          preferred_time: string
          service_id?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          calendar_event_id?: string | null
          client_id?: string | null
          created_at?: string
          email?: string
          id?: string
          meet_link?: string | null
          meeting_type?: string
          name?: string
          phone?: string | null
          preferred_date?: string
          preferred_time?: string
          service_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category: string
          content: string
          cover_url?: string | null
          created_at?: string
          excerpt: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          address: string | null
          cif: string | null
          created_at: string
          email: string | null
          founded_year: number | null
          id: number
          name: string
          phone: string | null
          schedule: string | null
          slogan: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          cif?: string | null
          created_at?: string
          email?: string | null
          founded_year?: number | null
          id: number
          name?: string
          phone?: string | null
          schedule?: string | null
          slogan?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          cif?: string | null
          created_at?: string
          email?: string | null
          founded_year?: number | null
          id?: number
          name?: string
          phone?: string | null
          schedule?: string | null
          slogan?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service_id: string | null
          source: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service_id?: string | null
          source?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service_id?: string | null
          source?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          client_name: string | null
          completion_date: string | null
          created_at: string
          description: string | null
          featured: boolean
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          location: string | null
          power_detail: string | null
          slug: string
          title: string
        }
        Insert: {
          category: string
          client_name?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          location?: string | null
          power_detail?: string | null
          slug: string
          title: string
        }
        Update: {
          category?: string
          client_name?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          location?: string | null
          power_detail?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          company_name: string
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          service_category: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          service_category?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          service_category?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          featured: boolean
          full_description: string | null
          icon: string
          id: string
          order_index: number
          short_description: string
          slug: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          featured?: boolean
          full_description?: string | null
          icon: string
          id?: string
          order_index?: number
          short_description: string
          slug: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          featured?: boolean
          full_description?: string | null
          icon?: string
          id?: string
          order_index?: number
          short_description?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string
          id: string
          order_index: number
          photo_url: string | null
          role_title: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name: string
          id?: string
          order_index?: number
          photo_url?: string | null
          role_title: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          order_index?: number
          photo_url?: string | null
          role_title?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          avatar_url: string | null
          content: string
          created_at: string
          featured: boolean
          id: string
          rating: number
          role_context: string | null
        }
        Insert: {
          author_name: string
          avatar_url?: string | null
          content: string
          created_at?: string
          featured?: boolean
          id?: string
          rating?: number
          role_context?: string | null
        }
        Update: {
          author_name?: string
          avatar_url?: string | null
          content?: string
          created_at?: string
          featured?: boolean
          id?: string
          rating?: number
          role_context?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_my_appointment: {
        Args: { appointment_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      link_provider_account: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Tables"]["providers"]["Row"] | null
      }
      request_callback: {
        Args: { p_name: string; p_phone: string; p_preferred_time: string }
        Returns: string
      }
      submit_contact_request: {
        Args: {
          p_email: string
          p_message: string
          p_name: string
          p_phone?: string
          p_service_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
