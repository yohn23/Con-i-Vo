export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          phone: string | null
          role: "client" | "company"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          phone?: string | null
          role: "client" | "company"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          phone?: string | null
          role?: "client" | "company"
          created_at?: string
          updated_at?: string
        }
      }
      client_profiles: {
        Row: {
          user_id: string
          address: string | null
          bio: string | null
          profile_image_url: string | null
          average_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          address?: string | null
          bio?: string | null
          profile_image_url?: string | null
          average_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          address?: string | null
          bio?: string | null
          profile_image_url?: string | null
          average_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      company_profiles: {
        Row: {
          user_id: string
          company_name: string
          business_license: string | null
          address: string | null
          description: string | null
          logo_url: string | null
          website: string | null
          average_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          company_name: string
          business_license?: string | null
          address?: string | null
          description?: string | null
          logo_url?: string | null
          website?: string | null
          average_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          company_name?: string
          business_license?: string | null
          address?: string | null
          description?: string | null
          logo_url?: string | null
          website?: string | null
          average_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          company_id: string
          category_id: string
          subcategory_id: number | null
          location: string
          budget: number | null
          status: "open" | "in_progress" | "completed" | "cancelled"
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          company_id: string
          category_id: string
          subcategory_id?: number | null
          location: string
          budget?: number | null
          status?: "open" | "in_progress" | "completed" | "cancelled"
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          company_id?: string
          category_id?: string
          subcategory_id?: number | null
          location?: string
          budget?: number | null
          status?: "open" | "in_progress" | "completed" | "cancelled"
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          project_id: string
          client_id: string
          bid_amount: number
          proposal: string
          experience: string | null
          status: "pending" | "accepted" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          client_id: string
          bid_amount: number
          proposal: string
          experience?: string | null
          status?: "pending" | "accepted" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          client_id?: string
          bid_amount?: number
          proposal?: string
          experience?: string | null
          status?: "pending" | "accepted" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name_en: string
          name_am: string
          description_en: string | null
          description_am: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_am: string
          description_en?: string | null
          description_am?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_am?: string
          description_en?: string | null
          description_am?: string | null
          created_at?: string
        }
      }
      subcategories: {
        Row: {
          id: number
          name_en: string
          name_am: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: number
          name_en: string
          name_am: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: number
          name_en?: string
          name_am?: string
          category_id?: string
          created_at?: string
        }
      }
    }
  }
}
