export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      markets: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          address: string | null
          city: string | null
          state: string | null
          state_code: string | null
          zip_code: string | null
          county: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          website: string | null
          email: string | null
          social_facebook: string | null
          social_instagram: string | null
          schedule: Json | null
          season_start: string | null
          season_end: string | null
          google_place_id: string | null
          google_rating: number | null
          google_reviews_count: number
          directions_url: string | null
          business_status: string | null
          price_range: string | null
          popular_times: Json | null
          products: Json | null
          payment_methods: Json | null
          featured_image: string | null
          photos: Json | null
          meta_title: string | null
          meta_description: string | null
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          last_enriched_at: string | null
          seo_title: string | null
          seo_description: string | null
          seo_features: Json | null
          seo_keywords: string[] | null
          reviews_tags: Json | null
          amenities: Json | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          state_code?: string | null
          zip_code?: string | null
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          email?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          schedule?: Json | null
          season_start?: string | null
          season_end?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number
          directions_url?: string | null
          business_status?: string | null
          price_range?: string | null
          popular_times?: Json | null
          products?: Json | null
          payment_methods?: Json | null
          featured_image?: string | null
          photos?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_enriched_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          state_code?: string | null
          zip_code?: string | null
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          email?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          schedule?: Json | null
          season_start?: string | null
          season_end?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number
          directions_url?: string | null
          business_status?: string | null
          price_range?: string | null
          popular_times?: Json | null
          products?: Json | null
          payment_methods?: Json | null
          featured_image?: string | null
          photos?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_enriched_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          market_id: string | null
          user_id: string | null
          source: string
          author_name: string | null
          rating: number | null
          content: string | null
          helpful_count: number
          created_at: string
        }
        Insert: {
          id?: string
          market_id?: string | null
          user_id?: string | null
          source?: string
          author_name?: string | null
          rating?: number | null
          content?: string | null
          helpful_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          market_id?: string | null
          user_id?: string | null
          source?: string
          author_name?: string | null
          rating?: number | null
          content?: string | null
          helpful_count?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
        }
      }
      market_categories: {
        Row: {
          market_id: string
          category_id: string
        }
        Insert: {
          market_id: string
          category_id: string
        }
        Update: {
          market_id?: string
          category_id?: string
        }
      }
      locations: {
        Row: {
          id: string
          type: string
          name: string
          slug: string
          state_code: string | null
          parent_id: string | null
          market_count: number
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          id?: string
          type: string
          name: string
          slug: string
          state_code?: string | null
          parent_id?: string | null
          market_count?: number
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          id?: string
          type?: string
          name?: string
          slug?: string
          state_code?: string | null
          parent_id?: string | null
          market_count?: number
          latitude?: number | null
          longitude?: number | null
        }
      }
      claims: {
        Row: {
          id: string
          market_id: string | null
          user_id: string | null
          status: string
          verification_document: string | null
          notes: string | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          market_id?: string | null
          user_id?: string | null
          status?: string
          verification_document?: string | null
          notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          market_id?: string | null
          user_id?: string | null
          status?: string
          verification_document?: string | null
          notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          is_market_owner: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_market_owner?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_market_owner?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          user_id: string
          market_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          market_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          market_id?: string
          created_at?: string
        }
      }
      sponsored_listings: {
        Row: {
          id: string
          market_id: string | null
          tier: string
          start_date: string
          end_date: string
          amount_paid: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          market_id?: string | null
          tier: string
          start_date: string
          end_date: string
          amount_paid?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          market_id?: string | null
          tier?: string
          start_date?: string
          end_date?: string
          amount_paid?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      ad_impressions: {
        Row: {
          id: string
          placement: string
          page_type: string | null
          impressions: number
          clicks: number
          date: string
        }
        Insert: {
          id?: string
          placement: string
          page_type?: string | null
          impressions?: number
          clicks?: number
          date: string
        }
        Update: {
          id?: string
          placement?: string
          page_type?: string | null
          impressions?: number
          clicks?: number
          date?: string
        }
      }
    }
    Functions: {
      increment_ad_impression: {
        Args: {
          p_placement: string
          p_page_type: string
        }
        Returns: undefined
      }
      increment_ad_click: {
        Args: {
          p_placement: string
          p_page_type: string
        }
        Returns: undefined
      }
    }
  }
}

// Convenience types
export type Market = Database['public']['Tables']['markets']['Row']
export type MarketInsert = Database['public']['Tables']['markets']['Insert']
export type MarketUpdate = Database['public']['Tables']['markets']['Update']

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']

export type Category = Database['public']['Tables']['categories']['Row']

export type Location = Database['public']['Tables']['locations']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Favorite = Database['public']['Tables']['favorites']['Row']

export type Claim = Database['public']['Tables']['claims']['Row']
export type ClaimInsert = Database['public']['Tables']['claims']['Insert']

export type SponsoredListing = Database['public']['Tables']['sponsored_listings']['Row']

// Extended types with relations
export interface MarketWithReviews extends Market {
  reviews: Review[]
}

export interface MarketWithCategories extends Market {
  categories: Category[]
}

export interface LocationWithMarkets extends Location {
  markets: Market[]
}

// Schedule type
export interface MarketSchedule {
  monday?: { open: string; close: string } | null
  tuesday?: { open: string; close: string } | null
  wednesday?: { open: string; close: string } | null
  thursday?: { open: string; close: string } | null
  friday?: { open: string; close: string } | null
  saturday?: { open: string; close: string } | null
  sunday?: { open: string; close: string } | null
}

// Products type
export interface MarketProducts {
  vegetables?: boolean
  fruits?: boolean
  meat?: boolean
  poultry?: boolean
  dairy?: boolean
  eggs?: boolean
  seafood?: boolean
  herbs?: boolean
  flowers?: boolean
  honey?: boolean
  jams?: boolean
  maple?: boolean
  nuts?: boolean
  plants?: boolean
  prepared?: boolean
  soap?: boolean
  wine?: boolean
  coffee?: boolean
  beans?: boolean
  crafts?: boolean
  [key: string]: boolean | undefined
}

// Payment methods type
export interface PaymentMethods {
  cash?: boolean
  credit?: boolean
  debit?: boolean
  snap?: boolean
  wic?: boolean
  sfmnp?: boolean
  [key: string]: boolean | undefined
}

// Search params
export interface MarketSearchParams {
  q?: string
  state?: string
  city?: string
  products?: string[]
  payment_methods?: string[]
  day?: string
  lat?: number
  lng?: number
  radius?: number
  page?: number
  limit?: number
  sort?: 'rating' | 'distance' | 'name'
}

// API response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface MarketSearchResponse extends PaginatedResponse<Market> {
  filters: {
    states: { state_code: string; count: number }[]
    cities: { city: string; state_code: string; count: number }[]
  }
}

// SEO Feature type for dynamic market highlights
export interface SeoFeature {
  type: string
  label: string
  icon: string
  text: string
}

// Amenities from Google/Outscraper about section
export interface MarketAmenities {
  'Wheelchair accessible'?: boolean
  'Wheelchair accessible entrance'?: boolean
  'Credit cards'?: boolean
  'Accepts credit cards'?: boolean
  'SNAP/EBT'?: boolean
  'Good for kids'?: boolean
  'Family-friendly'?: boolean
  'Dogs allowed'?: boolean
  'Women-owned'?: boolean
  'Veteran-owned'?: boolean
  'Black-owned'?: boolean
  'LGBTQ+ friendly'?: boolean
  [key: string]: boolean | undefined
}
