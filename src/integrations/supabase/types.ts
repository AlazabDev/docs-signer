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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      annual_grand_winners: {
        Row: {
          award_year: number
          certificate_url: string | null
          created_at: string | null
          id: string
          story: string | null
          technician_id: string | null
          video_url: string | null
        }
        Insert: {
          award_year: number
          certificate_url?: string | null
          created_at?: string | null
          id?: string
          story?: string | null
          technician_id?: string | null
          video_url?: string | null
        }
        Update: {
          award_year?: number
          certificate_url?: string | null
          created_at?: string | null
          id?: string
          story?: string | null
          technician_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annual_grand_winners_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_grand_winners_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_grand_winners_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      app_control: {
        Row: {
          id: string
          is_locked: boolean
          message: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          is_locked?: boolean
          message?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          is_locked?: boolean
          message?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          allow_edit_after_start: boolean | null
          allow_self_registration: boolean | null
          allow_technician_quotes: boolean | null
          app_logo_url: string | null
          app_name: string
          auto_backup_enabled: boolean | null
          background_color: string | null
          backup_frequency: string | null
          company_address: string | null
          company_email: string | null
          company_phone: string | null
          created_at: string
          custom_css: string | null
          default_currency: string | null
          default_language: string | null
          enable_2fa: boolean | null
          enable_email_notifications: boolean | null
          enable_in_app_notifications: boolean | null
          enable_reminders: boolean | null
          enable_sms_notifications: boolean | null
          enable_technician_rating: boolean | null
          erpnext_enabled: boolean | null
          erpnext_url: string | null
          google_maps_enabled: boolean | null
          id: string
          lock_sensitive_settings: boolean | null
          map_style: string | null
          max_execution_time: number | null
          notification_templates: Json | null
          notification_types: Json | null
          order_stages: Json | null
          primary_color: string | null
          require_manager_approval: boolean | null
          secondary_color: string | null
          session_timeout: number | null
          show_footer: boolean | null
          show_technicians_on_map: boolean | null
          smtp_from_email: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_username: string | null
          technician_statuses: Json | null
          theme_mode: string | null
          timezone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          allow_edit_after_start?: boolean | null
          allow_self_registration?: boolean | null
          allow_technician_quotes?: boolean | null
          app_logo_url?: string | null
          app_name?: string
          auto_backup_enabled?: boolean | null
          background_color?: string | null
          backup_frequency?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          created_at?: string
          custom_css?: string | null
          default_currency?: string | null
          default_language?: string | null
          enable_2fa?: boolean | null
          enable_email_notifications?: boolean | null
          enable_in_app_notifications?: boolean | null
          enable_reminders?: boolean | null
          enable_sms_notifications?: boolean | null
          enable_technician_rating?: boolean | null
          erpnext_enabled?: boolean | null
          erpnext_url?: string | null
          google_maps_enabled?: boolean | null
          id?: string
          lock_sensitive_settings?: boolean | null
          map_style?: string | null
          max_execution_time?: number | null
          notification_templates?: Json | null
          notification_types?: Json | null
          order_stages?: Json | null
          primary_color?: string | null
          require_manager_approval?: boolean | null
          secondary_color?: string | null
          session_timeout?: number | null
          show_footer?: boolean | null
          show_technicians_on_map?: boolean | null
          smtp_from_email?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_username?: string | null
          technician_statuses?: Json | null
          theme_mode?: string | null
          timezone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          allow_edit_after_start?: boolean | null
          allow_self_registration?: boolean | null
          allow_technician_quotes?: boolean | null
          app_logo_url?: string | null
          app_name?: string
          auto_backup_enabled?: boolean | null
          background_color?: string | null
          backup_frequency?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          created_at?: string
          custom_css?: string | null
          default_currency?: string | null
          default_language?: string | null
          enable_2fa?: boolean | null
          enable_email_notifications?: boolean | null
          enable_in_app_notifications?: boolean | null
          enable_reminders?: boolean | null
          enable_sms_notifications?: boolean | null
          enable_technician_rating?: boolean | null
          erpnext_enabled?: boolean | null
          erpnext_url?: string | null
          google_maps_enabled?: boolean | null
          id?: string
          lock_sensitive_settings?: boolean | null
          map_style?: string | null
          max_execution_time?: number | null
          notification_templates?: Json | null
          notification_types?: Json | null
          order_stages?: Json | null
          primary_color?: string | null
          require_manager_approval?: boolean | null
          secondary_color?: string | null
          session_timeout?: number | null
          show_footer?: boolean | null
          show_technicians_on_map?: boolean | null
          smtp_from_email?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_username?: string | null
          technician_statuses?: Json | null
          theme_mode?: string | null
          timezone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          created_by: string | null
          customer_email: string | null
          customer_email_enc: string | null
          customer_name: string
          customer_phone: string | null
          customer_phone_enc: string | null
          description: string | null
          duration_minutes: number
          id: string
          location: string | null
          maintenance_request_id: string | null
          notes: string | null
          property_id: string | null
          reminder_sent: boolean
          status: string
          title: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_email_enc?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_phone_enc?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean
          status?: string
          title: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_email_enc?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_phone_enc?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean
          status?: string
          title?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_qr_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      authorized_owners: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      branch_locations: {
        Row: {
          address: string | null
          branch: string
          branch_name: string | null
          branch_type: string | null
          city: string | null
          district: string | null
          icon: string | null
          id: string
          latitude: string | null
          link: string | null
          longitude: string | null
          phone: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          branch: string
          branch_name?: string | null
          branch_type?: string | null
          city?: string | null
          district?: string | null
          icon?: string | null
          id: string
          latitude?: string | null
          link?: string | null
          longitude?: string | null
          phone?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          branch?: string
          branch_name?: string | null
          branch_type?: string | null
          city?: string | null
          district?: string | null
          icon?: string | null
          id?: string
          latitude?: string | null
          link?: string | null
          longitude?: string | null
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string | null
          city: string | null
          code: string | null
          company_id: string
          created_at: string
          created_by: string | null
          geo: Json | null
          id: string
          name: string
          opening_hours: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          geo?: Json | null
          id?: string
          name: string
          opening_hours?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          geo?: Json | null
          id?: string
          name?: string
          opening_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number | null
        }
        Insert: {
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number | null
        }
        Update: {
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: number
          name_ar: string
        }
        Insert: {
          id?: number
          name_ar: string
        }
        Update: {
          id?: number
          name_ar?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          billing_cycle: string | null
          created_at: string
          created_by: string | null
          eta_tax_profile_id: string | null
          id: string
          name: string
          pricing_model: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          created_by?: string | null
          eta_tax_profile_id?: string | null
          id?: string
          name: string
          pricing_model?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          created_by?: string | null
          eta_tax_profile_id?: string | null
          id?: string
          name?: string
          pricing_model?: string | null
        }
        Relationships: []
      }
      daftra_sync_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          maintenance_request_id: string | null
          request_payload: Json | null
          response_payload: Json | null
          status: string
          sync_type: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          maintenance_request_id?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          status: string
          sync_type: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          maintenance_request_id?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "daftra_sync_logs_maintenance_request_id_fkey"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daftra_sync_logs_maintenance_request_id_fkey"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "technician_assigned_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daftra_sync_logs_maintenance_request_id_fkey"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "vw_maintenance_requests_public"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          city_id: number
          id: number
          name_ar: string
        }
        Insert: {
          city_id: number
          id?: number
          name_ar: string
        }
        Update: {
          city_id?: number
          id?: number
          name_ar?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      document_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string
          created_at: string
          document_id: string
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name: string
          created_at?: string
          document_id: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string
          created_at?: string
          document_id?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_audit_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_comments: {
        Row: {
          created_at: string
          document_id: string
          id: string
          page: number | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          text: string
          updated_at: string
          user_id: string | null
          user_name: string
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          created_at?: string
          document_id: string
          id?: string
          page?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          text: string
          updated_at?: string
          user_id?: string | null
          user_name: string
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          page?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          text?: string
          updated_at?: string
          user_id?: string | null
          user_name?: string
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_reviewers: {
        Row: {
          access_hash: string
          created_at: string
          department: string
          document_id: string
          id: string
          rejection_reason: string | null
          reviewer_email: string
          reviewer_name: string
          signature_data: string | null
          signed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          access_hash?: string
          created_at?: string
          department: string
          document_id: string
          id?: string
          rejection_reason?: string | null
          reviewer_email: string
          reviewer_name: string
          signature_data?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          access_hash?: string
          created_at?: string
          department?: string
          document_id?: string
          id?: string
          rejection_reason?: string | null
          reviewer_email?: string
          reviewer_name?: string
          signature_data?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_reviewers_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          document_id: string
          id: string
          ip_address: string | null
          pdf_hash: string | null
          signature_data: string
          signed_at: string
          signed_pdf_url: string | null
          signer_id: string | null
          signer_name: string
        }
        Insert: {
          document_id: string
          id?: string
          ip_address?: string | null
          pdf_hash?: string | null
          signature_data: string
          signed_at?: string
          signed_pdf_url?: string | null
          signer_id?: string | null
          signer_name: string
        }
        Update: {
          document_id?: string
          id?: string
          ip_address?: string | null
          pdf_hash?: string | null
          signature_data?: string
          signed_at?: string
          signed_pdf_url?: string | null
          signer_id?: string | null
          signer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string
          file_url: string
          id: string
          notes: string | null
          source: string
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id: string
          file_url: string
          id?: string
          notes?: string | null
          source: string
          version_number?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          file_url?: string
          id?: string
          notes?: string | null
          source?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          ai_extracted_data: Json | null
          ai_summary: string | null
          assigned_approver_id: string | null
          assigned_reviewer_id: string | null
          client_email: string | null
          client_name: string
          created_at: string
          created_by: string | null
          currency: string
          daftra_id: string | null
          date: string
          description: string | null
          file_hash: string | null
          file_url: string | null
          html_url: string | null
          id: string
          number: string
          payment_status: string
          pdf_url: string | null
          project_id: string | null
          raw_json: Json | null
          sender_name: string | null
          status: string
          synced_at: string | null
          title: string | null
          total: number
          type: string
          updated_at: string
        }
        Insert: {
          ai_extracted_data?: Json | null
          ai_summary?: string | null
          assigned_approver_id?: string | null
          assigned_reviewer_id?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          created_by?: string | null
          currency?: string
          daftra_id?: string | null
          date?: string
          description?: string | null
          file_hash?: string | null
          file_url?: string | null
          html_url?: string | null
          id?: string
          number: string
          payment_status?: string
          pdf_url?: string | null
          project_id?: string | null
          raw_json?: Json | null
          sender_name?: string | null
          status?: string
          synced_at?: string | null
          title?: string | null
          total?: number
          type: string
          updated_at?: string
        }
        Update: {
          ai_extracted_data?: Json | null
          ai_summary?: string | null
          assigned_approver_id?: string | null
          assigned_reviewer_id?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          daftra_id?: string | null
          date?: string
          description?: string | null
          file_hash?: string | null
          file_url?: string | null
          html_url?: string | null
          id?: string
          number?: string
          payment_status?: string
          pdf_url?: string | null
          project_id?: string | null
          raw_json?: Json | null
          sender_name?: string | null
          status?: string
          synced_at?: string | null
          title?: string | null
          total?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          count: number | null
          created_at: string | null
          error_hash: string | null
          first_seen_at: string | null
          id: string
          last_seen_at: string | null
          level: string
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          stack: string | null
          updated_at: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          error_hash?: string | null
          first_seen_at?: string | null
          id?: string
          last_seen_at?: string | null
          level?: string
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          stack?: string | null
          updated_at?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          error_hash?: string | null
          first_seen_at?: string | null
          id?: string
          last_seen_at?: string | null
          level?: string
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          stack?: string | null
          updated_at?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          maintenance_request_id: string | null
          request_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          maintenance_request_id?: string | null
          request_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          maintenance_request_id?: string | null
          request_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          folder: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          folder?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          folder?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hall_of_excellence: {
        Row: {
          achievement_date: string
          achievement_description: string | null
          achievement_title: string
          achievement_type: string
          created_at: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          media_urls: string[] | null
          story: string | null
          technician_id: string | null
        }
        Insert: {
          achievement_date: string
          achievement_description?: string | null
          achievement_title: string
          achievement_type: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          media_urls?: string[] | null
          story?: string | null
          technician_id?: string | null
        }
        Update: {
          achievement_date?: string
          achievement_description?: string | null
          achievement_title?: string
          achievement_type?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          media_urls?: string[] | null
          story?: string | null
          technician_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_of_excellence_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_of_excellence_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_of_excellence_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invoice_id: string
          quantity: number
          service_name: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id: string
          quantity?: number
          service_name: string
          total_price?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string
          quantity?: number
          service_name?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          due_date: string | null
          id: string
          invoice_number: string
          is_locked: boolean
          issue_date: string
          last_modified_by: string | null
          notes: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          is_locked?: boolean
          issue_date?: string
          last_modified_by?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          is_locked?: boolean
          issue_date?: string
          last_modified_by?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          archived_at: string | null
          asset_id: string | null
          assigned_technician_id: string | null
          assigned_vendor_id: string | null
          branch_id: string
          category_id: string | null
          channel: string | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string
          created_at: string
          created_by: string | null
          customer_notes: string | null
          daftra_invoice_id: string | null
          daftra_sync_status: string | null
          daftra_synced_at: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          last_modified_by: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          opened_by_role: string | null
          priority: string | null
          property_id: string | null
          rating: number | null
          service_type: string | null
          sla_accept_due: string | null
          sla_arrive_due: string | null
          sla_complete_due: string | null
          sla_deadline: string | null
          sla_due_date: string | null
          status: Database["public"]["Enums"]["mr_status"]
          subcategory_id: string | null
          title: string
          updated_at: string | null
          vendor_notes: string | null
          version: number
          workflow_stage: string | null
        }
        Insert: {
          actual_cost?: number | null
          archived_at?: string | null
          asset_id?: string | null
          assigned_technician_id?: string | null
          assigned_vendor_id?: string | null
          branch_id: string
          category_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          customer_notes?: string | null
          daftra_invoice_id?: string | null
          daftra_sync_status?: string | null
          daftra_synced_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          last_modified_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opened_by_role?: string | null
          priority?: string | null
          property_id?: string | null
          rating?: number | null
          service_type?: string | null
          sla_accept_due?: string | null
          sla_arrive_due?: string | null
          sla_complete_due?: string | null
          sla_deadline?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"]
          subcategory_id?: string | null
          title: string
          updated_at?: string | null
          vendor_notes?: string | null
          version?: number
          workflow_stage?: string | null
        }
        Update: {
          actual_cost?: number | null
          archived_at?: string | null
          asset_id?: string | null
          assigned_technician_id?: string | null
          assigned_vendor_id?: string | null
          branch_id?: string
          category_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          customer_notes?: string | null
          daftra_invoice_id?: string | null
          daftra_sync_status?: string | null
          daftra_synced_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          last_modified_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opened_by_role?: string | null
          priority?: string | null
          property_id?: string | null
          rating?: number | null
          service_type?: string | null
          sla_accept_due?: string | null
          sla_arrive_due?: string | null
          sla_complete_due?: string | null
          sla_deadline?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"]
          subcategory_id?: string | null
          title?: string
          updated_at?: string | null
          vendor_notes?: string | null
          version?: number
          workflow_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_maintenance_requests_assigned_vendor"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_maintenance_requests_assigned_vendor"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_qr_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_qr_public"
            referencedColumns: ["id"]
          },
        ]
      }
      message_logs: {
        Row: {
          created_at: string
          delivered_at: string | null
          error_message: string | null
          external_id: string | null
          id: string
          message_content: string
          message_type: string
          metadata: Json | null
          provider: string
          recipient: string
          request_id: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          message_content: string
          message_type: string
          metadata?: Json | null
          provider?: string
          recipient: string
          request_id?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          message_content?: string
          message_type?: string
          metadata?: Json | null
          provider?: string
          recipient?: string
          request_id?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "technician_assigned_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "vw_maintenance_requests_public"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          is_starred: boolean | null
          parent_message_id: string | null
          recipient_id: string
          sender_id: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          parent_message_id?: string | null
          recipient_id: string
          sender_id: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          parent_message_id?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      module_permissions: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          module_key: string
          module_name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          module_key: string
          module_name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          module_key?: string
          module_name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monthly_excellence_awards: {
        Row: {
          announcement_url: string | null
          award_month: string
          award_type: string
          certificate_url: string | null
          created_at: string | null
          id: string
          reward_description: string | null
          reward_value: number | null
          technician_id: string | null
        }
        Insert: {
          announcement_url?: string | null
          award_month: string
          award_type: string
          certificate_url?: string | null
          created_at?: string | null
          id?: string
          reward_description?: string | null
          reward_value?: number | null
          technician_id?: string | null
        }
        Update: {
          announcement_url?: string | null
          award_month?: string
          award_type?: string
          certificate_url?: string | null
          created_at?: string | null
          id?: string
          reward_description?: string | null
          reward_value?: number | null
          technician_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_excellence_awards_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_excellence_awards_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_excellence_awards_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string
          message_log_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string | null
          sms_sent: boolean | null
          title: string
          type: string
          updated_at: string
          whatsapp_sent: boolean | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message: string
          message_log_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          sms_sent?: boolean | null
          title: string
          type?: string
          updated_at?: string
          whatsapp_sent?: boolean | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          message_log_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          sms_sent?: boolean | null
          title?: string
          type?: string
          updated_at?: string
          whatsapp_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_message_log_id_fkey"
            columns: ["message_log_id"]
            isOneToOne: false
            referencedRelation: "message_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          action: string | null
          created_at: string | null
          expires_at: string
          id: string
          otp_code: string
          phone: string
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          otp_code: string
          phone: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          otp_code?: string
          phone?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: []
      }
      pending_technician_registrations: {
        Row: {
          company_name: string
          company_type: string
          created_at: string | null
          email: string
          expires_at: string | null
          full_name: string
          id: string
          phone: string
          profile_data: Json | null
        }
        Insert: {
          company_name: string
          company_type: string
          created_at?: string | null
          email: string
          expires_at?: string | null
          full_name: string
          id?: string
          phone: string
          profile_data?: Json | null
        }
        Update: {
          company_name?: string
          company_type?: string
          created_at?: string | null
          email?: string
          expires_at?: string | null
          full_name?: string
          id?: string
          phone?: string
          profile_data?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          iframe_key: string | null
          is_deleted: boolean | null
          last_modified_by: string | null
          last_name: string | null
          link_3d: string | null
          name: string
          phone: string | null
          photo_link: string | null
          plan_link: string | null
          position: string | null
          reports_to: string | null
          role: string
          updated_at: string | null
          updated_by: string | null
          version: number
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          iframe_key?: string | null
          is_deleted?: boolean | null
          last_modified_by?: string | null
          last_name?: string | null
          link_3d?: string | null
          name: string
          phone?: string | null
          photo_link?: string | null
          plan_link?: string | null
          position?: string | null
          reports_to?: string | null
          role: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          iframe_key?: string | null
          is_deleted?: boolean | null
          last_modified_by?: string | null
          last_name?: string | null
          link_3d?: string | null
          name?: string
          phone?: string | null
          photo_link?: string | null
          plan_link?: string | null
          position?: string | null
          reports_to?: string | null
          role?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number
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
      project_images: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          document_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          folder_name: string
          id: string
          is_featured: boolean | null
          mime_type: string | null
          project_id: string | null
          title: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          document_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          folder_name: string
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          project_id?: string | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          document_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          folder_name?: string
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          project_id?: string | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_images_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_cost: number | null
          actual_end_date: string | null
          budget: number | null
          company_name: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          gallery_url: string | null
          id: string
          last_modified_by: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          magicplan_iframe_url: string | null
          manager_id: string | null
          name: string
          progress: number | null
          project_type: string | null
          sketch_url: string | null
          start_date: string | null
          status: string
          updated_at: string | null
          version: number
        }
        Insert: {
          actual_cost?: number | null
          actual_end_date?: string | null
          budget?: number | null
          company_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          gallery_url?: string | null
          id: string
          last_modified_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          magicplan_iframe_url?: string | null
          manager_id?: string | null
          name: string
          progress?: number | null
          project_type?: string | null
          sketch_url?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          actual_cost?: number | null
          actual_end_date?: string | null
          budget?: number | null
          company_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          gallery_url?: string | null
          id?: string
          last_modified_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          magicplan_iframe_url?: string | null
          manager_id?: string | null
          name?: string
          progress?: number | null
          project_type?: string | null
          sketch_url?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          area: number | null
          bathrooms: number | null
          city_id: number | null
          code: string | null
          created_at: string
          created_by: string
          description: string | null
          district_id: number | null
          floors: number | null
          icon_url: string | null
          id: string
          images: string[] | null
          last_inspection_date: string | null
          last_modified_by: string | null
          latitude: number | null
          longitude: number | null
          maintenance_schedule: string | null
          manager_id: string | null
          name: string
          next_inspection_date: string | null
          parking_spaces: number | null
          qr_code_data: string | null
          qr_code_generated_at: string | null
          region_id: string | null
          rooms: number | null
          status: string
          type: string
          updated_at: string
          value: number | null
          version: number
        }
        Insert: {
          address: string
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          city_id?: number | null
          code?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          district_id?: number | null
          floors?: number | null
          icon_url?: string | null
          id?: string
          images?: string[] | null
          last_inspection_date?: string | null
          last_modified_by?: string | null
          latitude?: number | null
          longitude?: number | null
          maintenance_schedule?: string | null
          manager_id?: string | null
          name: string
          next_inspection_date?: string | null
          parking_spaces?: number | null
          qr_code_data?: string | null
          qr_code_generated_at?: string | null
          region_id?: string | null
          rooms?: number | null
          status?: string
          type: string
          updated_at?: string
          value?: number | null
          version?: number
        }
        Update: {
          address?: string
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          city_id?: number | null
          code?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          district_id?: number | null
          floors?: number | null
          icon_url?: string | null
          id?: string
          images?: string[] | null
          last_inspection_date?: string | null
          last_modified_by?: string | null
          latitude?: number | null
          longitude?: number | null
          maintenance_schedule?: string | null
          manager_id?: string | null
          name?: string
          next_inspection_date?: string | null
          parking_spaces?: number | null
          qr_code_data?: string | null
          qr_code_generated_at?: string | null
          region_id?: string | null
          rooms?: number | null
          status?: string
          type?: string
          updated_at?: string
          value?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "properties_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      request_approvals: {
        Row: {
          approval_type: string
          approved_at: string | null
          approver_id: string
          comments: string | null
          created_at: string
          id: string
          request_id: string
          status: string
        }
        Insert: {
          approval_type: string
          approved_at?: string | null
          approver_id: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id: string
          status: string
        }
        Update: {
          approval_type?: string
          approved_at?: string | null
          approver_id?: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id?: string
          status?: string
        }
        Relationships: []
      }
      request_lifecycle: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          request_id: string
          status: Database["public"]["Enums"]["maintenance_status"]
          update_notes: string | null
          update_type: Database["public"]["Enums"]["update_type"]
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          request_id: string
          status: Database["public"]["Enums"]["maintenance_status"]
          update_notes?: string | null
          update_type: Database["public"]["Enums"]["update_type"]
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          request_id?: string
          status?: Database["public"]["Enums"]["maintenance_status"]
          update_notes?: string | null
          update_type?: Database["public"]["Enums"]["update_type"]
          updated_by?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          images: string[] | null
          rating: number
          request_id: string | null
          technician_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          images?: string[] | null
          rating: number
          request_id?: string | null
          technician_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          images?: string[] | null
          rating?: number
          request_id?: string | null
          technician_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_review_request"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_review_request"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "technician_assigned_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_review_request"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "vw_maintenance_requests_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_review_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_review_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_review_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          action: string
          created_at: string | null
          id: string
          resource: string
          role: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          resource: string
          role: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          resource?: string
          role?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      service_items: {
        Row: {
          base_price: number
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
          subcategory_id: number | null
        }
        Insert: {
          base_price: number
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
          subcategory_id?: number | null
        }
        Update: {
          base_price?: number
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          subcategory_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_items_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "service_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_subcategories: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          name: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name: string
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number | null
          category_id: string | null
          code: string
          created_at: string | null
          description: string | null
          description_ar: string | null
          description_en: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          max_qty: number | null
          min_qty: number | null
          name: string | null
          name_ar: string
          name_en: string | null
          pricing_type: string
          sort_order: number | null
          subcategory_id: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          category_id?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          max_qty?: number | null
          min_qty?: number | null
          name?: string | null
          name_ar: string
          name_en?: string | null
          pricing_type?: string
          sort_order?: number | null
          subcategory_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          category_id?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          max_qty?: number | null
          min_qty?: number | null
          name?: string | null
          name_ar?: string
          name_en?: string | null
          pricing_type?: string
          sort_order?: number | null
          subcategory_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sla_policies: {
        Row: {
          accept_within_min: number
          arrive_within_min: number
          category_id: string | null
          complete_within_min: number
          created_at: string | null
          id: string
          priority: string
        }
        Insert: {
          accept_within_min: number
          arrive_within_min: number
          category_id?: string | null
          complete_within_min: number
          created_at?: string | null
          id?: string
          priority: string
        }
        Update: {
          accept_within_min?: number
          arrive_within_min?: number
          category_id?: string | null
          complete_within_min?: number
          created_at?: string | null
          id?: string
          priority?: string
        }
        Relationships: [
          {
            foreignKeyName: "sla_policies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      specialization_icons: {
        Row: {
          color: string | null
          icon_path: string
          id: string
          is_active: boolean | null
          name: string
          name_ar: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          icon_path: string
          id?: string
          is_active?: boolean | null
          name: string
          name_ar: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          icon_path?: string
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      technician_agreements: {
        Row: {
          conduct_policy_accepted: boolean | null
          created_at: string | null
          customer_respect_policy_accepted: boolean | null
          id: string
          ip_address: string | null
          pricing_policy_accepted: boolean | null
          punctuality_policy_accepted: boolean | null
          quality_policy_accepted: boolean | null
          signed_at: string | null
          technician_id: string
        }
        Insert: {
          conduct_policy_accepted?: boolean | null
          created_at?: string | null
          customer_respect_policy_accepted?: boolean | null
          id?: string
          ip_address?: string | null
          pricing_policy_accepted?: boolean | null
          punctuality_policy_accepted?: boolean | null
          quality_policy_accepted?: boolean | null
          signed_at?: string | null
          technician_id: string
        }
        Update: {
          conduct_policy_accepted?: boolean | null
          created_at?: string | null
          customer_respect_policy_accepted?: boolean | null
          id?: string
          ip_address?: string | null
          pricing_policy_accepted?: boolean | null
          punctuality_policy_accepted?: boolean | null
          quality_policy_accepted?: boolean | null
          signed_at?: string | null
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_agreements_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_agreements_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_badges: {
        Row: {
          awarded_at: string | null
          awarded_for: string | null
          badge_description: string | null
          badge_title: string
          badge_type: string
          created_at: string | null
          id: string
          technician_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          awarded_for?: string | null
          badge_description?: string | null
          badge_title: string
          badge_type: string
          created_at?: string | null
          id?: string
          technician_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          awarded_for?: string | null
          badge_description?: string | null
          badge_title?: string
          badge_type?: string
          created_at?: string | null
          id?: string
          technician_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_badge_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_badge_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_badge_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_badges_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_badges_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_badges_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_coverage: {
        Row: {
          city_id: number | null
          created_at: string | null
          district_id: number | null
          id: string
          radius_km: number | null
          technician_id: string
        }
        Insert: {
          city_id?: number | null
          created_at?: string | null
          district_id?: number | null
          id?: string
          radius_km?: number | null
          technician_id: string
        }
        Update: {
          city_id?: number | null
          created_at?: string | null
          district_id?: number | null
          id?: string
          radius_km?: number | null
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_coverage_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_coverage_areas: {
        Row: {
          city_id: number | null
          city_name: string | null
          created_at: string | null
          district_id: number | null
          district_name: string | null
          id: string
          radius_km: number | null
          technician_id: string
        }
        Insert: {
          city_id?: number | null
          city_name?: string | null
          created_at?: string | null
          district_id?: number | null
          district_name?: string | null
          id?: string
          radius_km?: number | null
          technician_id: string
        }
        Update: {
          city_id?: number | null
          city_name?: string | null
          created_at?: string | null
          district_id?: number | null
          district_name?: string | null
          id?: string
          radius_km?: number | null
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_coverage_areas_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_areas_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_areas_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_areas_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_areas_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_coverage_areas_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_daily_stats: {
        Row: {
          average_arrival_time: number | null
          average_rating: number | null
          average_response_time: number | null
          complaints_received: number | null
          created_at: string
          date: string
          id: string
          technician_id: string
          total_earnings: number | null
          updated_at: string
          visits_accepted: number | null
          visits_assigned: number | null
          visits_cancelled: number | null
          visits_completed: number | null
          visits_rejected: number | null
        }
        Insert: {
          average_arrival_time?: number | null
          average_rating?: number | null
          average_response_time?: number | null
          complaints_received?: number | null
          created_at?: string
          date?: string
          id?: string
          technician_id: string
          total_earnings?: number | null
          updated_at?: string
          visits_accepted?: number | null
          visits_assigned?: number | null
          visits_cancelled?: number | null
          visits_completed?: number | null
          visits_rejected?: number | null
        }
        Update: {
          average_arrival_time?: number | null
          average_rating?: number | null
          average_response_time?: number | null
          complaints_received?: number | null
          created_at?: string
          date?: string
          id?: string
          technician_id?: string
          total_earnings?: number | null
          updated_at?: string
          visits_accepted?: number | null
          visits_assigned?: number | null
          visits_cancelled?: number | null
          visits_completed?: number | null
          visits_rejected?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_daily_stats_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_daily_stats_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_daily_stats_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_documents: {
        Row: {
          document_type: Database["public"]["Enums"]["document_type_enum"]
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          technician_id: string
          uploaded_at: string | null
        }
        Insert: {
          document_type: Database["public"]["Enums"]["document_type_enum"]
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          technician_id: string
          uploaded_at?: string | null
        }
        Update: {
          document_type?: Database["public"]["Enums"]["document_type_enum"]
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          technician_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_documents_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_documents_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_documents_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_documents_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_levels: {
        Row: {
          created_at: string | null
          current_level: string | null
          id: string
          level_updated_at: string | null
          promotion_history: Json | null
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_level?: string | null
          id?: string
          level_updated_at?: string | null
          promotion_history?: Json | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_level?: string | null
          id?: string
          level_updated_at?: string | null
          promotion_history?: Json | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_level_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_level_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_level_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_levels_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_levels_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_levels_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_location: {
        Row: {
          lat: number | null
          lng: number | null
          technician_id: string
          updated_at: string | null
        }
        Insert: {
          lat?: number | null
          lng?: number | null
          technician_id: string
          updated_at?: string | null
        }
        Update: {
          lat?: number | null
          lng?: number | null
          technician_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_location_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_location_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_location_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_monthly_bonuses: {
        Row: {
          acceptance_rate: number | null
          average_arrival_time: number | null
          average_rating: number | null
          average_response_time: number | null
          cancellation_rate: number | null
          commitment_bonus: number | null
          complaints_count: number | null
          created_at: string
          id: string
          month: string
          paid_at: string | null
          quality_bonus: number | null
          status: string | null
          super_pro_bonus: number | null
          technician_id: string
          time_bonus: number | null
          top_rated_bonus: number | null
          total_bonus: number
          updated_at: string
          visits_completed: number
        }
        Insert: {
          acceptance_rate?: number | null
          average_arrival_time?: number | null
          average_rating?: number | null
          average_response_time?: number | null
          cancellation_rate?: number | null
          commitment_bonus?: number | null
          complaints_count?: number | null
          created_at?: string
          id?: string
          month: string
          paid_at?: string | null
          quality_bonus?: number | null
          status?: string | null
          super_pro_bonus?: number | null
          technician_id: string
          time_bonus?: number | null
          top_rated_bonus?: number | null
          total_bonus?: number
          updated_at?: string
          visits_completed?: number
        }
        Update: {
          acceptance_rate?: number | null
          average_arrival_time?: number | null
          average_rating?: number | null
          average_response_time?: number | null
          cancellation_rate?: number | null
          commitment_bonus?: number | null
          complaints_count?: number | null
          created_at?: string
          id?: string
          month?: string
          paid_at?: string | null
          quality_bonus?: number | null
          status?: string | null
          super_pro_bonus?: number | null
          technician_id?: string
          time_bonus?: number | null
          top_rated_bonus?: number | null
          total_bonus?: number
          updated_at?: string
          visits_completed?: number
        }
        Relationships: [
          {
            foreignKeyName: "technician_monthly_bonuses_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_monthly_bonuses_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_monthly_bonuses_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_performance: {
        Row: {
          average_rating: number | null
          cancelled_tasks: number | null
          complaints_count: number | null
          completed_tasks: number | null
          created_at: string | null
          excellence_count: number | null
          id: string
          last_calculated_at: string | null
          professionalism_score: number | null
          punctuality_score: number | null
          quality_score: number | null
          technician_id: string | null
          total_points: number | null
          total_tasks: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          cancelled_tasks?: number | null
          complaints_count?: number | null
          completed_tasks?: number | null
          created_at?: string | null
          excellence_count?: number | null
          id?: string
          last_calculated_at?: string | null
          professionalism_score?: number | null
          punctuality_score?: number | null
          quality_score?: number | null
          technician_id?: string | null
          total_points?: number | null
          total_tasks?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          cancelled_tasks?: number | null
          complaints_count?: number | null
          completed_tasks?: number | null
          created_at?: string | null
          excellence_count?: number | null
          id?: string
          last_calculated_at?: string | null
          professionalism_score?: number | null
          punctuality_score?: number | null
          quality_score?: number | null
          technician_id?: string | null
          total_points?: number | null
          total_tasks?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_perf_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_perf_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_perf_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_performance_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_performance_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_performance_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_profiles: {
        Row: {
          accepts_emergency_jobs: boolean | null
          accepts_national_contracts: boolean | null
          accounting_email: string | null
          accounting_name: string | null
          accounting_phone: string | null
          additional_notes: string | null
          agree_payment_terms: boolean | null
          agree_terms: boolean | null
          building_no: string | null
          city_id: number | null
          company_model: string | null
          company_name: string
          company_type: string | null
          contact_name: string | null
          country: string | null
          created_at: string | null
          district_id: number | null
          email: string
          floor: string | null
          full_name: string
          has_insurance: boolean | null
          id: string
          insurance_company_name: string | null
          insurance_notes: string | null
          landmark: string | null
          number_of_inhouse_technicians: number | null
          number_of_office_staff: number | null
          phone: string
          policy_expiry_date: string | null
          policy_number: string | null
          preferred_language: string | null
          pricing_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_email: string | null
          status: string | null
          street_address: string | null
          submitted_at: string | null
          terms_accepted_at: string | null
          unit: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accepts_emergency_jobs?: boolean | null
          accepts_national_contracts?: boolean | null
          accounting_email?: string | null
          accounting_name?: string | null
          accounting_phone?: string | null
          additional_notes?: string | null
          agree_payment_terms?: boolean | null
          agree_terms?: boolean | null
          building_no?: string | null
          city_id?: number | null
          company_model?: string | null
          company_name: string
          company_type?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          district_id?: number | null
          email: string
          floor?: string | null
          full_name: string
          has_insurance?: boolean | null
          id?: string
          insurance_company_name?: string | null
          insurance_notes?: string | null
          landmark?: string | null
          number_of_inhouse_technicians?: number | null
          number_of_office_staff?: number | null
          phone: string
          policy_expiry_date?: string | null
          policy_number?: string | null
          preferred_language?: string | null
          pricing_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_email?: string | null
          status?: string | null
          street_address?: string | null
          submitted_at?: string | null
          terms_accepted_at?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepts_emergency_jobs?: boolean | null
          accepts_national_contracts?: boolean | null
          accounting_email?: string | null
          accounting_name?: string | null
          accounting_phone?: string | null
          additional_notes?: string | null
          agree_payment_terms?: boolean | null
          agree_terms?: boolean | null
          building_no?: string | null
          city_id?: number | null
          company_model?: string | null
          company_name?: string
          company_type?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          district_id?: number | null
          email?: string
          floor?: string | null
          full_name?: string
          has_insurance?: boolean | null
          id?: string
          insurance_company_name?: string | null
          insurance_notes?: string | null
          landmark?: string | null
          number_of_inhouse_technicians?: number | null
          number_of_office_staff?: number | null
          phone?: string
          policy_expiry_date?: string | null
          policy_number?: string | null
          preferred_language?: string | null
          pricing_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_email?: string | null
          status?: string | null
          street_address?: string | null
          submitted_at?: string | null
          terms_accepted_at?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_profiles_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_service_prices: {
        Row: {
          created_at: string | null
          emergency_price: number | null
          id: string
          material_markup_percent: number | null
          min_job_value: number | null
          night_weekend_price: number | null
          platform_price: number | null
          service_id: number
          service_name: string | null
          standard_price: number
          technician_id: string
        }
        Insert: {
          created_at?: string | null
          emergency_price?: number | null
          id?: string
          material_markup_percent?: number | null
          min_job_value?: number | null
          night_weekend_price?: number | null
          platform_price?: number | null
          service_id: number
          service_name?: string | null
          standard_price: number
          technician_id: string
        }
        Update: {
          created_at?: string | null
          emergency_price?: number | null
          id?: string
          material_markup_percent?: number | null
          min_job_value?: number | null
          night_weekend_price?: number | null
          platform_price?: number | null
          service_id?: number
          service_name?: string | null
          standard_price?: number
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_service_prices_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_service_prices_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_service_prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_service_prices_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_service_prices_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_services: {
        Row: {
          created_at: string | null
          experience_years: number | null
          id: string
          is_primary: boolean | null
          service_id: string
          technician_id: string
        }
        Insert: {
          created_at?: string | null
          experience_years?: number | null
          id?: string
          is_primary?: boolean | null
          service_id: string
          technician_id: string
        }
        Update: {
          created_at?: string | null
          experience_years?: number | null
          id?: string
          is_primary?: boolean | null
          service_id?: string
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_services_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_services_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_services_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_skill_tests: {
        Row: {
          answers_data: Json | null
          completed_at: string | null
          created_at: string | null
          grade: string | null
          id: string
          questions_data: Json | null
          score: number | null
          specialization: string
          technician_id: string | null
        }
        Insert: {
          answers_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          grade?: string | null
          id?: string
          questions_data?: Json | null
          score?: number | null
          specialization: string
          technician_id?: string | null
        }
        Update: {
          answers_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          grade?: string | null
          id?: string
          questions_data?: Json | null
          score?: number | null
          specialization?: string
          technician_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_skill_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_skill_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_skill_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_tests_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_tests_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_tests_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_tasks: {
        Row: {
          actual_duration: number | null
          after_photos: string[] | null
          before_photos: string[] | null
          check_in_at: string | null
          check_in_photo: string | null
          check_out_at: string | null
          created_at: string | null
          customer_location: string | null
          estimated_duration: number | null
          estimated_price: number | null
          id: string
          latitude: number | null
          longitude: number | null
          maintenance_request_id: string | null
          status: string | null
          task_description: string | null
          task_title: string
          technician_id: string | null
          updated_at: string | null
          work_report: string | null
        }
        Insert: {
          actual_duration?: number | null
          after_photos?: string[] | null
          before_photos?: string[] | null
          check_in_at?: string | null
          check_in_photo?: string | null
          check_out_at?: string | null
          created_at?: string | null
          customer_location?: string | null
          estimated_duration?: number | null
          estimated_price?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          maintenance_request_id?: string | null
          status?: string | null
          task_description?: string | null
          task_title: string
          technician_id?: string | null
          updated_at?: string | null
          work_report?: string | null
        }
        Update: {
          actual_duration?: number | null
          after_photos?: string[] | null
          before_photos?: string[] | null
          check_in_at?: string | null
          check_in_photo?: string | null
          check_out_at?: string | null
          created_at?: string | null
          customer_location?: string | null
          estimated_duration?: number | null
          estimated_price?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          maintenance_request_id?: string | null
          status?: string | null
          task_description?: string | null
          task_title?: string
          technician_id?: string | null
          updated_at?: string | null
          work_report?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_task_request"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_task_request"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "technician_assigned_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_task_request"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "vw_maintenance_requests_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_task_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_task_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_task_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_tasks_maintenance_request_id_fkey"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_tasks_maintenance_request_id_fkey"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "technician_assigned_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_tasks_maintenance_request_id_fkey"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "vw_maintenance_requests_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_tasks_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_tasks_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_tasks_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_trades: {
        Row: {
          can_handle_heavy_projects: boolean | null
          category_id: number
          category_name: string | null
          created_at: string | null
          id: string
          licenses_or_certifications: string | null
          technician_id: string
          years_of_experience: number | null
        }
        Insert: {
          can_handle_heavy_projects?: boolean | null
          category_id: number
          category_name?: string | null
          created_at?: string | null
          id?: string
          licenses_or_certifications?: string | null
          technician_id: string
          years_of_experience?: number | null
        }
        Update: {
          can_handle_heavy_projects?: boolean | null
          category_id?: number
          category_name?: string | null
          created_at?: string | null
          id?: string
          licenses_or_certifications?: string | null
          technician_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_trades_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_trades_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_trades_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_trades_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_trades_technician_profile_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_training: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          course_title: string
          course_type: string
          created_at: string | null
          id: string
          progress: number | null
          score: number | null
          status: string | null
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          course_title: string
          course_type: string
          created_at?: string | null
          id?: string
          progress?: number | null
          score?: number | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          course_title?: string
          course_type?: string
          created_at?: string | null
          id?: string
          progress?: number | null
          score?: number | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_training_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_training_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_training_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          net_amount: number
          platform_fee: number | null
          request_id: string | null
          status: string
          technician_id: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          net_amount: number
          platform_fee?: number | null
          request_id?: string | null
          status?: string
          technician_id: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number
          platform_fee?: number | null
          request_id?: string | null
          status?: string
          technician_id?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_transactions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_transactions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "technician_assigned_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_transactions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "vw_maintenance_requests_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_transactions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_transactions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_transactions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_verifications: {
        Row: {
          created_at: string | null
          id: string
          national_id_back: string | null
          national_id_front: string | null
          rejection_reason: string | null
          selfie_image: string | null
          technician_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          national_id_back?: string | null
          national_id_front?: string | null
          rejection_reason?: string | null
          selfie_image?: string | null
          technician_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          national_id_back?: string | null
          national_id_front?: string | null
          rejection_reason?: string | null
          selfie_image?: string | null
          technician_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_verifications_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_verifications_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_wallet: {
        Row: {
          balance_current: number
          balance_locked: number
          balance_pending: number
          created_at: string
          id: string
          last_withdrawal_at: string | null
          minimum_withdrawal: number
          technician_id: string
          total_earnings: number
          total_withdrawn: number
          updated_at: string
        }
        Insert: {
          balance_current?: number
          balance_locked?: number
          balance_pending?: number
          created_at?: string
          id?: string
          last_withdrawal_at?: string | null
          minimum_withdrawal?: number
          technician_id: string
          total_earnings?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Update: {
          balance_current?: number
          balance_locked?: number
          balance_pending?: number
          created_at?: string
          id?: string
          last_withdrawal_at?: string | null
          minimum_withdrawal?: number
          technician_id?: string
          total_earnings?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_wallet_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_wallet_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_wallet_technician"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_wallet_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_wallet_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_wallet_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_withdrawals: {
        Row: {
          account_details: Json
          amount: number
          created_at: string
          id: string
          method: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          rejection_reason: string | null
          requested_at: string
          status: string
          technician_id: string
          updated_at: string
        }
        Insert: {
          account_details?: Json
          amount: number
          created_at?: string
          id?: string
          method: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          requested_at?: string
          status?: string
          technician_id: string
          updated_at?: string
        }
        Update: {
          account_details?: Json
          amount?: number
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          requested_at?: string
          status?: string
          technician_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_withdrawal_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_withdrawal_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_withdrawal_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_withdrawals_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_withdrawals_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_withdrawals_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_withdrawals_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_withdrawals_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_withdrawals_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          application_id: string | null
          available_from: string | null
          available_to: string | null
          bio: string | null
          certifications: Json | null
          city_id: number | null
          code: string | null
          company_id: string | null
          country_code: string | null
          created_at: string | null
          created_by: string | null
          current_latitude: number | null
          current_longitude: number | null
          district_id: number | null
          email: string | null
          hourly_rate: number | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          lat: number | null
          level: string
          lng: number | null
          location_updated_at: string | null
          name: string
          phone: string | null
          primary_service_id: string | null
          profile_image: string | null
          rating: number | null
          service_area_radius: number | null
          specialization: string
          standard_rate: number | null
          status: string | null
          technician_profile_id: string | null
          total_reviews: number | null
          updated_at: string | null
          verification_center_id: string | null
          verification_notes: string | null
          verified_at: string | null
          visit_fee: number | null
        }
        Insert: {
          application_id?: string | null
          available_from?: string | null
          available_to?: string | null
          bio?: string | null
          certifications?: Json | null
          city_id?: number | null
          code?: string | null
          company_id?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          district_id?: number | null
          email?: string | null
          hourly_rate?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          lat?: number | null
          level?: string
          lng?: number | null
          location_updated_at?: string | null
          name: string
          phone?: string | null
          primary_service_id?: string | null
          profile_image?: string | null
          rating?: number | null
          service_area_radius?: number | null
          specialization: string
          standard_rate?: number | null
          status?: string | null
          technician_profile_id?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          verification_center_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          visit_fee?: number | null
        }
        Update: {
          application_id?: string | null
          available_from?: string | null
          available_to?: string | null
          bio?: string | null
          certifications?: Json | null
          city_id?: number | null
          code?: string | null
          company_id?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          district_id?: number | null
          email?: string | null
          hourly_rate?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          lat?: number | null
          level?: string
          lng?: number | null
          location_updated_at?: string | null
          name?: string
          phone?: string | null
          primary_service_id?: string | null
          profile_image?: string | null
          rating?: number | null
          service_area_radius?: number | null
          specialization?: string
          standard_rate?: number | null
          status?: string | null
          technician_profile_id?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          verification_center_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          visit_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technicians_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technicians_technician_profile_id_fkey"
            columns: ["technician_profile_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technicians_technician_profile_id_fkey"
            columns: ["technician_profile_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          last_updated: string
          latitude: number
          longitude: number
          vendor_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated?: string
          latitude: number
          longitude: number
          vendor_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated?: string
          latitude?: number
          longitude?: number
          vendor_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string
          current_latitude: number | null
          current_longitude: number | null
          email: string | null
          experience_years: number | null
          id: string
          is_tracking_enabled: boolean | null
          last_modified_by: string | null
          location_updated_at: string | null
          map_icon: string | null
          name: string
          phone: string | null
          profile_image: string | null
          rating: number | null
          specialization: string[] | null
          status: string | null
          total_jobs: number | null
          tracking_started_at: string | null
          unit_rate: number | null
          updated_at: string
          version: number
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          email?: string | null
          experience_years?: number | null
          id?: string
          is_tracking_enabled?: boolean | null
          last_modified_by?: string | null
          location_updated_at?: string | null
          map_icon?: string | null
          name: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
          total_jobs?: number | null
          tracking_started_at?: string | null
          unit_rate?: number | null
          updated_at?: string
          version?: number
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          email?: string | null
          experience_years?: number | null
          id?: string
          is_tracking_enabled?: boolean | null
          last_modified_by?: string | null
          location_updated_at?: string | null
          map_icon?: string | null
          name?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
          total_jobs?: number | null
          tracking_started_at?: string | null
          unit_rate?: number | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      app_settings_public_safe: {
        Row: {
          app_logo_url: string | null
          app_name: string | null
          background_color: string | null
          company_address: string | null
          company_email: string | null
          company_phone: string | null
          default_currency: string | null
          default_language: string | null
          enable_technician_rating: boolean | null
          google_maps_enabled: boolean | null
          id: string | null
          map_style: string | null
          primary_color: string | null
          secondary_color: string | null
          show_footer: boolean | null
          show_technicians_on_map: boolean | null
          theme_mode: string | null
          timezone: string | null
        }
        Insert: {
          app_logo_url?: string | null
          app_name?: string | null
          background_color?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          default_currency?: string | null
          default_language?: string | null
          enable_technician_rating?: boolean | null
          google_maps_enabled?: boolean | null
          id?: string | null
          map_style?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          show_footer?: boolean | null
          show_technicians_on_map?: boolean | null
          theme_mode?: string | null
          timezone?: string | null
        }
        Update: {
          app_logo_url?: string | null
          app_name?: string | null
          background_color?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          default_currency?: string | null
          default_language?: string | null
          enable_technician_rating?: boolean | null
          google_maps_enabled?: boolean | null
          id?: string | null
          map_style?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          show_footer?: boolean | null
          show_technicians_on_map?: boolean | null
          theme_mode?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
      app_settings_safe: {
        Row: {
          allow_self_registration: boolean | null
          app_logo_url: string | null
          app_name: string | null
          background_color: string | null
          company_address: string | null
          company_email: string | null
          company_phone: string | null
          default_currency: string | null
          default_language: string | null
          enable_email_notifications: boolean | null
          enable_in_app_notifications: boolean | null
          enable_sms_notifications: boolean | null
          enable_technician_rating: boolean | null
          google_maps_enabled: boolean | null
          id: string | null
          map_style: string | null
          primary_color: string | null
          require_manager_approval: boolean | null
          secondary_color: string | null
          show_footer: boolean | null
          show_technicians_on_map: boolean | null
          theme_mode: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          allow_self_registration?: boolean | null
          app_logo_url?: string | null
          app_name?: string | null
          background_color?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          default_currency?: string | null
          default_language?: string | null
          enable_email_notifications?: boolean | null
          enable_in_app_notifications?: boolean | null
          enable_sms_notifications?: boolean | null
          enable_technician_rating?: boolean | null
          google_maps_enabled?: boolean | null
          id?: string | null
          map_style?: string | null
          primary_color?: string | null
          require_manager_approval?: boolean | null
          secondary_color?: string | null
          show_footer?: boolean | null
          show_technicians_on_map?: boolean | null
          theme_mode?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_self_registration?: boolean | null
          app_logo_url?: string | null
          app_name?: string | null
          background_color?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          default_currency?: string | null
          default_language?: string | null
          enable_email_notifications?: boolean | null
          enable_in_app_notifications?: boolean | null
          enable_sms_notifications?: boolean | null
          enable_technician_rating?: boolean | null
          google_maps_enabled?: boolean | null
          id?: string | null
          map_style?: string | null
          primary_color?: string | null
          require_manager_approval?: boolean | null
          secondary_color?: string | null
          show_footer?: boolean | null
          show_technicians_on_map?: boolean | null
          theme_mode?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      appointments_public_safe: {
        Row: {
          appointment_date: string | null
          appointment_time: string | null
          created_at: string | null
          customer_name_masked: string | null
          description: string | null
          duration_minutes: number | null
          id: string | null
          location: string | null
          maintenance_request_id: string | null
          notes: string | null
          property_id: string | null
          reminder_sent: boolean | null
          status: string | null
          title: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          customer_name_masked?: never
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          customer_name_masked?: never
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_qr_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_public_safe: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          full_name: string | null
          id: string | null
          name: string | null
          position: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          full_name?: string | null
          id?: string | null
          name?: string | null
          position?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          full_name?: string | null
          id?: string | null
          name?: string | null
          position?: string | null
          role?: string | null
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
      profiles_safe: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          full_name: string | null
          id: string | null
          name: string | null
          position: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          full_name?: string | null
          id?: string | null
          name?: string | null
          position?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          full_name?: string | null
          id?: string | null
          name?: string | null
          position?: string | null
          role?: string | null
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
      properties_qr_public: {
        Row: {
          city_id: number | null
          code: string | null
          district_id: number | null
          id: string | null
          name: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          city_id?: number | null
          code?: string | null
          district_id?: number | null
          id?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          city_id?: number | null
          code?: string | null
          district_id?: number | null
          id?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_assigned_requests: {
        Row: {
          assigned_technician_id: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string | null
          description: string | null
          id: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          priority: string | null
          sla_complete_due: string | null
          status: Database["public"]["Enums"]["mr_status"] | null
          technician_name: string | null
          technician_phone: string | null
          title: string | null
          workflow_stage: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technicians_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_profiles_safe: {
        Row: {
          city_id: number | null
          created_at: string | null
          district_id: number | null
          full_name: string | null
          id: string | null
          status: string | null
        }
        Insert: {
          city_id?: number | null
          created_at?: string | null
          district_id?: number | null
          full_name?: string | null
          id?: string | null
          status?: string | null
        }
        Update: {
          city_id?: number | null
          created_at?: string | null
          district_id?: number | null
          full_name?: string | null
          id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_profiles_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians_map_public: {
        Row: {
          available_from: string | null
          available_to: string | null
          bio: string | null
          current_latitude: number | null
          current_longitude: number | null
          hourly_rate: number | null
          icon_url: string | null
          id: string | null
          is_verified: boolean | null
          level: string | null
          location_updated_at: string | null
          name: string | null
          rating: number | null
          service_area_radius: number | null
          specialization: string | null
          status: string | null
          total_reviews: number | null
        }
        Relationships: []
      }
      technicians_public: {
        Row: {
          current_latitude: number | null
          current_longitude: number | null
          icon_url: string | null
          id: string | null
          is_active: boolean | null
          level: string | null
          name: string | null
          profile_image: string | null
          rating: number | null
          specialization: string | null
          status: string | null
          total_reviews: number | null
        }
        Insert: {
          current_latitude?: number | null
          current_longitude?: number | null
          icon_url?: string | null
          id?: string | null
          is_active?: boolean | null
          level?: string | null
          name?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string | null
          status?: string | null
          total_reviews?: number | null
        }
        Update: {
          current_latitude?: number | null
          current_longitude?: number | null
          icon_url?: string | null
          id?: string | null
          is_active?: boolean | null
          level?: string | null
          name?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string | null
          status?: string | null
          total_reviews?: number | null
        }
        Relationships: []
      }
      technicians_public_safe: {
        Row: {
          icon_url: string | null
          id: string | null
          is_active: boolean | null
          lat_approx: number | null
          level: string | null
          lng_approx: number | null
          name: string | null
          profile_image: string | null
          rating: number | null
          specialization: string | null
          status: string | null
          total_reviews: number | null
        }
        Insert: {
          icon_url?: string | null
          id?: string | null
          is_active?: boolean | null
          lat_approx?: never
          level?: string | null
          lng_approx?: never
          name?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string | null
          status?: string | null
          total_reviews?: number | null
        }
        Update: {
          icon_url?: string | null
          id?: string | null
          is_active?: boolean | null
          lat_approx?: never
          level?: string | null
          lng_approx?: never
          name?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string | null
          status?: string | null
          total_reviews?: number | null
        }
        Relationships: []
      }
      vendors_public_safe: {
        Row: {
          address: string | null
          company_name: string | null
          id: string | null
          name: string | null
          rating: number | null
          specialization: string[] | null
          status: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          id?: string | null
          name?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          id?: string | null
          name?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
        }
        Relationships: []
      }
      vw_maintenance_requests_public: {
        Row: {
          actual_cost: number | null
          archived_at: string | null
          asset_id: string | null
          assigned_vendor_id: string | null
          branch_id: string | null
          category_id: string | null
          channel: string | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          customer_notes: string | null
          description: string | null
          estimated_cost: number | null
          id: string | null
          last_modified_by: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          opened_by_role: string | null
          priority: string | null
          property_id: string | null
          rating: number | null
          service_type: string | null
          sla_accept_due: string | null
          sla_arrive_due: string | null
          sla_complete_due: string | null
          sla_deadline: string | null
          sla_due_date: string | null
          status: Database["public"]["Enums"]["mr_status"] | null
          subcategory_id: string | null
          title: string | null
          updated_at: string | null
          vendor_notes: string | null
          version: number | null
          workflow_stage: string | null
        }
        Insert: {
          actual_cost?: number | null
          archived_at?: string | null
          asset_id?: string | null
          assigned_vendor_id?: string | null
          branch_id?: string | null
          category_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_notes?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string | null
          last_modified_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opened_by_role?: string | null
          priority?: string | null
          property_id?: string | null
          rating?: number | null
          service_type?: string | null
          sla_accept_due?: string | null
          sla_arrive_due?: string | null
          sla_complete_due?: string | null
          sla_deadline?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"] | null
          subcategory_id?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_notes?: string | null
          version?: number | null
          workflow_stage?: string | null
        }
        Update: {
          actual_cost?: number | null
          archived_at?: string | null
          asset_id?: string | null
          assigned_vendor_id?: string | null
          branch_id?: string | null
          category_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_notes?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string | null
          last_modified_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opened_by_role?: string | null
          priority?: string | null
          property_id?: string | null
          rating?: number | null
          service_type?: string | null
          sla_accept_due?: string | null
          sla_arrive_due?: string | null
          sla_complete_due?: string | null
          sla_deadline?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"] | null
          subcategory_id?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_notes?: string | null
          version?: number | null
          workflow_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_maintenance_requests_assigned_vendor"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_maintenance_requests_assigned_vendor"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mr_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_qr_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_qr_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_technician_profile: {
        Args: { profile_id: string }
        Returns: string
      }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_sla_deadlines: {
        Args: {
          p_category_id?: string
          p_priority: string
          p_request_id: string
        }
        Returns: undefined
      }
      calculate_sla_due_date: {
        Args: {
          created_at: string
          priority_level: string
          service_type: string
        }
        Returns: string
      }
      can_access_full_appointment: {
        Args: { appointment_id: string }
        Returns: boolean
      }
      can_access_service_request: {
        Args: { request_id: string }
        Returns: boolean
      }
      can_transition_stage: {
        Args: { current_stage: string; next_stage: string; user_role: string }
        Returns: boolean
      }
      complete_technician_registration: {
        Args: { p_email: string }
        Returns: Json
      }
      create_technician_draft: {
        Args: { fullname: string; phone: string }
        Returns: undefined
      }
      find_nearest_vendor: {
        Args: {
          request_latitude: number
          request_longitude: number
          service_specialization?: string
        }
        Returns: {
          distance: number
          email: string
          phone: string
          vendor_id: string
          vendor_name: string
        }[]
      }
      generate_invoice_number: { Args: never; Returns: string }
      get_appointment_contact_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_appointment_customer_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_appointments_for_staff: {
        Args: never
        Returns: {
          appointment_date: string
          appointment_time: string
          created_at: string
          description: string
          duration_minutes: number
          id: string
          location: string
          maintenance_request_id: string
          notes: string
          property_id: string
          reminder_sent: boolean
          status: string
          title: string
          updated_at: string
          vendor_id: string
        }[]
      }
      get_cities_for_user: {
        Args: { p_user_id: string }
        Returns: {
          city_id: string
          country: string
          name: string
        }[]
      }
      get_current_user_company_id: { Args: never; Returns: string }
      get_customer_contact_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_customer_email: { Args: { appointment_id: string }; Returns: string }
      get_customer_name: { Args: { appointment_id: string }; Returns: string }
      get_customer_phone: { Args: { appointment_id: string }; Returns: string }
      get_full_customer_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_mr_client_info: {
        Args: { request_id: string }
        Returns: {
          client_email: string
          client_name: string
          client_phone: string
        }[]
      }
      get_safe_app_settings: {
        Args: never
        Returns: {
          app_logo_url: string
          app_name: string
          background_color: string
          company_address: string
          company_email: string
          company_phone: string
          default_currency: string
          default_language: string
          primary_color: string
          secondary_color: string
          theme_mode: string
          timezone: string
        }[]
      }
      get_search_statistics: {
        Args: { project_id_param?: string; search_query: string }
        Returns: {
          avg_relevance: number
          by_file_type: Json
          by_project: Json
          total_results: number
        }[]
      }
      get_smtp_settings: {
        Args: never
        Returns: {
          smtp_from_email: string
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_username: string
        }[]
      }
      get_table_row_counts: {
        Args: never
        Returns: {
          row_count: number
          table_name: string
        }[]
      }
      get_technician_id_for_user: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_technicians_for_map: {
        Args: never
        Returns: {
          available_from: string
          available_to: string
          bio: string
          current_latitude: number
          current_longitude: number
          hourly_rate: number
          icon_url: string
          id: string
          is_verified: boolean
          level: string
          location_updated_at: string
          name: string
          rating: number
          service_area_radius: number
          specialization: string
          status: string
          total_reviews: number
        }[]
      }
      get_user_tenant: { Args: never; Returns: string }
      get_vendor_appointments: {
        Args: never
        Returns: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_name: string
          description: string
          duration_minutes: number
          id: string
          location: string
          maintenance_request_id: string
          notes: string
          property_id: string
          reminder_sent: boolean
          status: string
          title: string
          updated_at: string
          vendor_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_authorized_owner: { Args: { _user_id: string }; Returns: boolean }
      is_email_confirmed: { Args: never; Returns: boolean }
      is_owner_email: { Args: never; Returns: boolean }
      is_staff:
        | { Args: never; Returns: boolean }
        | { Args: { uid: string }; Returns: boolean }
      is_valid_egyptian_phone: { Args: { phone: string }; Returns: boolean }
      recalc_request_totals: {
        Args: { p_request_id: string }
        Returns: undefined
      }
      register_technician_profile: {
        Args: {
          p_company_name: string
          p_company_type: string
          p_email: string
          p_full_name: string
          p_password: string
          p_phone: string
          p_profile_data?: Json
        }
        Returns: Json
      }
      search_files: {
        Args: {
          file_type_param?: string
          limit_count?: number
          offset_count?: number
          project_id_param?: string
          search_query: string
        }
        Returns: {
          file_size: number
          file_type: string
          id: string
          original_filename: string
          project_name: string
          relevance_score: number
          storage_url: string
          text_content_preview: string
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "manager"
        | "staff"
        | "technician"
        | "vendor"
        | "customer"
        | "warehouse"
        | "accounting"
        | "engineering"
        | "dispatcher"
      company_model_enum: "local_provider" | "third_party"
      company_type_enum: "individual" | "small_team" | "company"
      document_type_enum:
        | "tax_card"
        | "commercial_registration"
        | "national_id"
        | "insurance_certificate"
        | "professional_license"
      maintenance_stage:
        | "DRAFT"
        | "SUBMITTED"
        | "TRIAGED"
        | "ASSIGNED"
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "INSPECTION"
        | "COMPLETED"
        | "BILLED"
        | "PAID"
        | "CLOSED"
        | "ON_HOLD"
        | "WAITING_PARTS"
        | "CANCELLED"
        | "REJECTED"
      maintenance_status:
        | "draft"
        | "submitted"
        | "acknowledged"
        | "assigned"
        | "scheduled"
        | "in_progress"
        | "inspection"
        | "waiting_parts"
        | "completed"
        | "billed"
        | "paid"
        | "closed"
        | "cancelled"
        | "on_hold"
      maintenance_status_v2:
        | "submitted"
        | "triaged"
        | "needs_info"
        | "scheduled"
        | "in_progress"
        | "paused"
        | "escalated"
        | "completed"
        | "qa_review"
        | "closed"
        | "reopened"
        | "canceled"
        | "rejected"
      mr_status:
        | "Open"
        | "Assigned"
        | "InProgress"
        | "Waiting"
        | "Completed"
        | "Rejected"
        | "Cancelled"
      priority_level: "low" | "medium" | "high"
      provider_type_t: "internal_team" | "external_vendor"
      request_status_t:
        | "draft"
        | "awaiting_vendor"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      technician_status:
        | "draft"
        | "pending_review"
        | "approved"
        | "rejected"
        | "active"
        | "suspended"
      update_type:
        | "status_change"
        | "assignment"
        | "scheduling"
        | "cost_estimate"
        | "completion"
        | "feedback"
        | "payment"
        | "note"
      wo_status:
        | "Pending"
        | "Scheduled"
        | "EnRoute"
        | "InProgress"
        | "Paused"
        | "Completed"
        | "Cancelled"
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
      app_role: [
        "admin",
        "manager",
        "staff",
        "technician",
        "vendor",
        "customer",
        "warehouse",
        "accounting",
        "engineering",
        "dispatcher",
      ],
      company_model_enum: ["local_provider", "third_party"],
      company_type_enum: ["individual", "small_team", "company"],
      document_type_enum: [
        "tax_card",
        "commercial_registration",
        "national_id",
        "insurance_certificate",
        "professional_license",
      ],
      maintenance_stage: [
        "DRAFT",
        "SUBMITTED",
        "TRIAGED",
        "ASSIGNED",
        "SCHEDULED",
        "IN_PROGRESS",
        "INSPECTION",
        "COMPLETED",
        "BILLED",
        "PAID",
        "CLOSED",
        "ON_HOLD",
        "WAITING_PARTS",
        "CANCELLED",
        "REJECTED",
      ],
      maintenance_status: [
        "draft",
        "submitted",
        "acknowledged",
        "assigned",
        "scheduled",
        "in_progress",
        "inspection",
        "waiting_parts",
        "completed",
        "billed",
        "paid",
        "closed",
        "cancelled",
        "on_hold",
      ],
      maintenance_status_v2: [
        "submitted",
        "triaged",
        "needs_info",
        "scheduled",
        "in_progress",
        "paused",
        "escalated",
        "completed",
        "qa_review",
        "closed",
        "reopened",
        "canceled",
        "rejected",
      ],
      mr_status: [
        "Open",
        "Assigned",
        "InProgress",
        "Waiting",
        "Completed",
        "Rejected",
        "Cancelled",
      ],
      priority_level: ["low", "medium", "high"],
      provider_type_t: ["internal_team", "external_vendor"],
      request_status_t: [
        "draft",
        "awaiting_vendor",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      technician_status: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
        "active",
        "suspended",
      ],
      update_type: [
        "status_change",
        "assignment",
        "scheduling",
        "cost_estimate",
        "completion",
        "feedback",
        "payment",
        "note",
      ],
      wo_status: [
        "Pending",
        "Scheduled",
        "EnRoute",
        "InProgress",
        "Paused",
        "Completed",
        "Cancelled",
      ],
    },
  },
} as const
