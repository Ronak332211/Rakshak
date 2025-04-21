
// Mock data for the WSMS application

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Complaint {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved';
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
}

export interface Division {
  id: string;
  name: string;
  location: string;
  phoneNumber: string;
  email: string;
}

// Categories
export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Harassment",
    description: "Any form of unwanted physical or verbal behavior",
    icon: "alert-triangle"
  },
  {
    id: "cat-2",
    name: "Theft",
    description: "Stealing of personal belongings or property",
    icon: "briefcase"
  },
  {
    id: "cat-3",
    name: "Assault",
    description: "Physical attack or threat of attack",
    icon: "alert-octagon"
  },
  {
    id: "cat-4",
    name: "Stalking",
    description: "Unwanted or obsessive attention",
    icon: "eye"
  },
  {
    id: "cat-5",
    name: "Cyberbullying",
    description: "Online harassment or intimidation",
    icon: "globe"
  },
  {
    id: "cat-6",
    name: "Domestic Violence",
    description: "Violence in a domestic setting",
    icon: "home"
  }
];

// Divisions
export const divisions: Division[] = [
  {
    id: "div-1",
    name: "Central Division",
    location: "123 Main St, Center City",
    phoneNumber: "123-456-7890",
    email: "central@police.gov"
  },
  {
    id: "div-2",
    name: "Northern Division",
    location: "456 North Ave, North City",
    phoneNumber: "123-456-7891",
    email: "northern@police.gov"
  },
  {
    id: "div-3",
    name: "Southern Division",
    location: "789 South Blvd, South City",
    phoneNumber: "123-456-7892",
    email: "southern@police.gov"
  }
];

// Complaints
export const complaints: Complaint[] = [
  {
    id: "comp-1",
    userId: "user-1",
    categoryId: "cat-1",
    title: "Verbal harassment at workplace",
    description: "I've been facing verbal harassment from a colleague at my workplace",
    location: "Office Building, 123 Work St",
    status: "in-progress",
    assignedTo: "police-1",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-16T14:20:00Z"
  },
  {
    id: "comp-2",
    userId: "user-1",
    categoryId: "cat-2",
    title: "Purse snatched at mall",
    description: "My purse was snatched while shopping at Central Mall",
    location: "Central Mall, Shopping District",
    status: "resolved",
    assignedTo: "police-2",
    createdAt: "2023-04-20T15:45:00Z",
    updatedAt: "2023-04-25T09:15:00Z"
  },
  {
    id: "comp-3",
    userId: "user-2",
    categoryId: "cat-4",
    title: "Being followed on my commute",
    description: "I noticed someone following me on my daily commute for the past week",
    location: "Between Home and Office",
    status: "pending",
    assignedTo: null,
    createdAt: "2023-05-18T08:30:00Z",
    updatedAt: "2023-05-18T08:30:00Z"
  }
];

// Guardians
export const guardians: Guardian[] = [
  {
    id: "guard-1",
    userId: "user-1",
    name: "John Doe",
    relationship: "Brother",
    phoneNumber: "123-456-7890",
    email: "john.doe@example.com"
  },
  {
    id: "guard-2",
    userId: "user-1",
    name: "Mary Smith",
    relationship: "Friend",
    phoneNumber: "123-456-7891",
    email: "mary.smith@example.com"
  }
];

// Helper function to get complaints by user ID
export const getComplaintsByUserId = (userId: string): Complaint[] => {
  return complaints.filter(complaint => complaint.userId === userId);
};

// Helper function to get complaints by assigned officer ID
export const getComplaintsByOfficerId = (officerId: string): Complaint[] => {
  return complaints.filter(complaint => complaint.assignedTo === officerId);
};

// Helper function to get guardians by user ID
export const getGuardiansByUserId = (userId: string): Guardian[] => {
  return guardians.filter(guardian => guardian.userId === userId);
};

// Helper function to get category by ID
export const getCategoryById = (categoryId: string): Category | undefined => {
  return categories.find(category => category.id === categoryId);
};

// Helper function to get division by ID
export const getDivisionById = (divisionId: string): Division | undefined => {
  return divisions.find(division => division.id === divisionId);
};
