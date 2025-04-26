import { supabase } from '@/supabaseClient';
import { Complaint, Category, Guardian, User, PoliceOfficer, ComplaintWithRelations } from './supabaseTypes';

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
};

// Complaints
export const fetchComplaints = async (): Promise<Complaint[]> => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }

  return data || [];
};

export const fetchComplaintsByUserId = async (userId: string): Promise<ComplaintWithRelations[]> => {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      category:category_id(id, name, description, icon)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user complaints:', error);
    throw error;
  }

  return data || [];
};

export const fetchComplaintsByOfficerId = async (officerId: string): Promise<ComplaintWithRelations[]> => {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      category:category_id(id, name, description, icon),
      created_by:user_id(id, name, email, phone_number)
    `)
    .eq('assigned_to', officerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching officer complaints:', error);
    throw error;
  }

  return data || [];
};

export const fetchComplaintById = async (id: string): Promise<ComplaintWithRelations | null> => {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      category:category_id(id, name, description, icon),
      assigned_officer:assigned_to(id, name, email, badge_id),
      created_by:user_id(id, name, email, phone_number)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching complaint details:', error);
    return null;
  }

  return data;
};

export const createComplaint = async (complaint: Complaint): Promise<Complaint | null> => {
  const { data, error } = await supabase
    .from('complaints')
    .insert([complaint])
    .select()
    .single();

  if (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }

  return data;
};

export const updateComplaint = async (id: string, updates: Partial<Complaint>): Promise<Complaint | null> => {
  const { data, error } = await supabase
    .from('complaints')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }

  return data;
};

// Guardians
export const fetchGuardiansByUserId = async (userId: string): Promise<Guardian[]> => {
  const { data, error } = await supabase
    .from('guardians')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) {
    console.error('Error fetching guardians:', error);
    throw error;
  }

  return data || [];
};

export const createGuardian = async (guardian: Guardian): Promise<Guardian | null> => {
  const { data, error } = await supabase
    .from('guardians')
    .insert([guardian])
    .select()
    .single();

  if (error) {
    console.error('Error creating guardian:', error);
    throw error;
  }

  return data;
};

export const updateGuardian = async (id: string, updates: Partial<Guardian>): Promise<Guardian | null> => {
  const { data, error } = await supabase
    .from('guardians')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating guardian:', error);
    throw error;
  }

  return data;
};

export const deleteGuardian = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('guardians')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting guardian:', error);
    throw error;
  }
};

// Upload evidence
export const uploadEvidence = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `evidence/${fileName}`;

  const { error } = await supabase.storage
    .from('complaints')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading evidence:', error);
    throw error;
  }

  const { data } = supabase.storage
    .from('complaints')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Seed initial categories if they don't exist
export const seedCategories = async (): Promise<void> => {
  const { count, error: countError } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking categories:', countError);
    return;
  }

  // If no categories exist, seed initial ones
  if (count === 0) {
    const initialCategories: Omit<Category, 'id' | 'created_at'>[] = [
      {
        name: "Harassment",
        description: "Any form of unwanted physical or verbal behavior",
        icon: "alert-triangle"
      },
      {
        name: "Theft",
        description: "Stealing of personal belongings or property",
        icon: "briefcase"
      },
      {
        name: "Assault",
        description: "Physical attack or threat of attack",
        icon: "alert-octagon"
      },
      {
        name: "Stalking",
        description: "Unwanted or obsessive attention",
        icon: "eye"
      },
      {
        name: "Cyberbullying",
        description: "Online harassment or intimidation",
        icon: "globe"
      },
      {
        name: "Domestic Violence",
        description: "Violence in a domestic setting",
        icon: "home"
      }
    ];

    const { error: insertError } = await supabase
      .from('categories')
      .insert(initialCategories);

    if (insertError) {
      console.error('Error seeding categories:', insertError);
    } else {
      console.log('Categories seeded successfully');
    }
  }
}; 