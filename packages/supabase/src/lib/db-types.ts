export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Domain: {
        Row: {
          archived: boolean
          createdAt: string
          id: string
          lastChecked: string
          primary: boolean
          slug: string
          updatedAt: string
          verified: boolean
          workspaceId: string | null
        }
        Insert: {
          archived?: boolean
          createdAt?: string
          id: string
          lastChecked?: string
          primary?: boolean
          slug: string
          updatedAt: string
          verified?: boolean
          workspaceId?: string | null
        }
        Update: {
          archived?: boolean
          createdAt?: string
          id?: string
          lastChecked?: string
          primary?: boolean
          slug?: string
          updatedAt?: string
          verified?: boolean
          workspaceId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Domain_workspaceId_fkey"
            columns: ["workspaceId"]
            isOneToOne: false
            referencedRelation: "Workspace"
            referencedColumns: ["id"]
          },
        ]
      }
      Plan: {
        Row: {
          createdAt: string
          description: string
          features: string[] | null
          id: string
          maxDomains: number
          maxProjects: number
          maxUsers: number
          name: string
          slug: string
          status: Database["public"]["Enums"]["PlanStatus"]
          stripeProductId: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description: string
          features?: string[] | null
          id: string
          maxDomains: number
          maxProjects: number
          maxUsers: number
          name: string
          slug: string
          status?: Database["public"]["Enums"]["PlanStatus"]
          stripeProductId?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string
          features?: string[] | null
          id?: string
          maxDomains?: number
          maxProjects?: number
          maxUsers?: number
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["PlanStatus"]
          stripeProductId?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      Price: {
        Row: {
          amount: number
          createdAt: string
          id: string
          interval: Database["public"]["Enums"]["PriceInterval"]
          planId: string
          status: Database["public"]["Enums"]["PriceStatus"]
          stripePriceId: string | null
          updatedAt: string
        }
        Insert: {
          amount: number
          createdAt?: string
          id: string
          interval: Database["public"]["Enums"]["PriceInterval"]
          planId: string
          status?: Database["public"]["Enums"]["PriceStatus"]
          stripePriceId?: string | null
          updatedAt: string
        }
        Update: {
          amount?: number
          createdAt?: string
          id?: string
          interval?: Database["public"]["Enums"]["PriceInterval"]
          planId?: string
          status?: Database["public"]["Enums"]["PriceStatus"]
          stripePriceId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Price_planId_fkey"
            columns: ["planId"]
            isOneToOne: false
            referencedRelation: "Plan"
            referencedColumns: ["id"]
          },
        ]
      }
      Project: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          password: string | null
          slug: string
          updatedAt: string
          workspaceSlug: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          name: string
          password?: string | null
          slug: string
          updatedAt: string
          workspaceSlug: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          password?: string | null
          slug?: string
          updatedAt?: string
          workspaceSlug?: string
        }
        Relationships: [
          {
            foreignKeyName: "Project_workspaceSlug_fkey"
            columns: ["workspaceSlug"]
            isOneToOne: false
            referencedRelation: "Workspace"
            referencedColumns: ["slug"]
          },
        ]
      }
      Workspace: {
        Row: {
          createdAt: string
          customerId: string | null
          description: string | null
          id: string
          name: string
          planId: string | null
          slug: string
          status: Database["public"]["Enums"]["WorkspaceStatus"]
          subscriptionId: string | null
          subscriptionStatus: Database["public"]["Enums"]["StripeStatus"] | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          customerId?: string | null
          description?: string | null
          id: string
          name: string
          planId?: string | null
          slug: string
          status?: Database["public"]["Enums"]["WorkspaceStatus"]
          subscriptionId?: string | null
          subscriptionStatus?:
            | Database["public"]["Enums"]["StripeStatus"]
            | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          customerId?: string | null
          description?: string | null
          id?: string
          name?: string
          planId?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["WorkspaceStatus"]
          subscriptionId?: string | null
          subscriptionStatus?:
            | Database["public"]["Enums"]["StripeStatus"]
            | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Workspace_planId_fkey"
            columns: ["planId"]
            isOneToOne: false
            referencedRelation: "Plan"
            referencedColumns: ["id"]
          },
        ]
      }
      WorkspaceInvite: {
        Row: {
          createdAt: string
          email: string
          expires: string
          workspaceId: string
        }
        Insert: {
          createdAt?: string
          email: string
          expires: string
          workspaceId: string
        }
        Update: {
          createdAt?: string
          email?: string
          expires?: string
          workspaceId?: string
        }
        Relationships: [
          {
            foreignKeyName: "WorkspaceInvite_workspaceId_fkey"
            columns: ["workspaceId"]
            isOneToOne: false
            referencedRelation: "Workspace"
            referencedColumns: ["id"]
          },
        ]
      }
      WorkspaceUser: {
        Row: {
          createdAt: string
          id: string
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
          userId: string
          workspaceId: string
        }
        Insert: {
          createdAt?: string
          id: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt: string
          userId: string
          workspaceId: string
        }
        Update: {
          createdAt?: string
          id?: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
          userId?: string
          workspaceId?: string
        }
        Relationships: [
          {
            foreignKeyName: "WorkspaceUser_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WorkspaceUser_workspaceId_fkey"
            columns: ["workspaceId"]
            isOneToOne: false
            referencedRelation: "Workspace"
            referencedColumns: ["id"]
          },
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
      PlanStatus: "active" | "inactive"
      PriceInterval: "month" | "year"
      PriceStatus: "active" | "inactive"
      Role: "owner" | "member"
      StripeStatus:
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      WorkspaceStatus: "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

