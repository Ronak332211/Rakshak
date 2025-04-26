export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at?: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category_id: string;
  category?: Category;
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  evidence_urls?: string[];
  created_at: string;
  updated_at?: string;
}

export interface Guardian {
  id?: string;
  user_id: string;
  name: string;
  relationship: string;
  phone_number: string;
  email: string;
  created_at?: string;
}

export interface Division {
  id: string;
  name: string;
  location: string;
  phone_number: string;
  email: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  created_at?: string;
}

export interface PoliceOfficer {
  id: string;
  name: string;
  email: string;
  badge_id: string;
  division_id?: string;
  created_at?: string;
}

export type ComplaintWithRelations = Complaint & {
  category?: Category;
  assigned_officer?: PoliceOfficer;
  created_by?: User;
} 