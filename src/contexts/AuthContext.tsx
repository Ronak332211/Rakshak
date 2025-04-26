import React, { createContext, useState, useContext, useEffect } from 'react';

type UserRole = 'user' | 'police' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  registerPolice: (name: string, email: string, password: string, badgeId: string) => Promise<boolean>;
  registerAdmin: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isFirstAdminRegistered: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstAdminRegistered, setIsFirstAdminRegistered] = useState(false);
  const [policeRegistry, setPoliceRegistry] = useState<{[key: string]: boolean}>({});
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('wsms_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
      setIsAuthenticated(true);
    }
    
    // Check if admin is registered
    const adminRegistered = localStorage.getItem('wsms_admin_registered');
    if (adminRegistered === 'true') {
      setIsFirstAdminRegistered(true);
    }
    
    // Load police registry
    let storedPoliceRegistry = localStorage.getItem('wsms_police_registry');
    if (!storedPoliceRegistry) {
      // Initialize with a test badge ID for demo purposes
      const initialRegistry = { 'PD12345': true };
      localStorage.setItem('wsms_police_registry', JSON.stringify(initialRegistry));
      storedPoliceRegistry = JSON.stringify(initialRegistry);
    }
    
    if (storedPoliceRegistry) {
      setPoliceRegistry(JSON.parse(storedPoliceRegistry));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string, userRole: UserRole): Promise<boolean> => {
    try {
      // For admin, check if admin is registered
      if (userRole === 'admin') {
        if (!isFirstAdminRegistered) {
          return false; // Admin not registered yet
        }
        
        const adminData = localStorage.getItem('wsms_admin_data');
        if (adminData) {
          const admin = JSON.parse(adminData);
          if (email === admin.email && password === admin.password) {
            const adminUser = {
              id: 'admin-1',
              name: admin.name,
              email: admin.email,
              role: 'admin' as const
            };
            
            setUser(adminUser);
            setRole('admin');
            setIsAuthenticated(true);
            localStorage.setItem('wsms_user', JSON.stringify(adminUser));
            return true;
          }
        }
        return false;
      } 
      // For police login
      else if (userRole === 'police') {
        const policeData = localStorage.getItem('wsms_police_data');
        if (policeData) {
          const policeUsers = JSON.parse(policeData);
          const officer = policeUsers.find((p: any) => p.email === email && p.password === password);
          
          if (officer) {
            const policeUser = {
              id: officer.id,
              name: officer.name,
              email: officer.email,
              role: 'police' as const
            };
            
            setUser(policeUser);
            setRole('police');
            setIsAuthenticated(true);
            localStorage.setItem('wsms_user', JSON.stringify(policeUser));
            return true;
          }
        }
        
        // For demo purposes, still allow the default user
        if (email === 'police@example.com' && password === 'police123') {
          const policeUser = {
            id: 'police-1',
            name: 'Police Officer',
            email: 'police@example.com',
            role: 'police' as const
          };
          
          setUser(policeUser);
          setRole('police');
          setIsAuthenticated(true);
          localStorage.setItem('wsms_user', JSON.stringify(policeUser));
          return true;
        }
        
        return false;
      }
      // For regular user login
      else if (userRole === 'user') {
        const userData = localStorage.getItem('wsms_users_data');
        if (userData) {
          const users = JSON.parse(userData);
          const foundUser = users.find((u: any) => u.email === email && u.password === password);
          
          if (foundUser) {
            const regularUser = {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              role: 'user' as const
            };
            
            setUser(regularUser);
            setRole('user');
            setIsAuthenticated(true);
            localStorage.setItem('wsms_user', JSON.stringify(regularUser));
            return true;
          }
        }
        
        // For demo purposes, still allow the default user
        if (email === 'user@example.com' && password === 'user123') {
          const regularUser = {
            id: 'user-1',
            name: 'Jane Doe',
            email: 'user@example.com',
            role: 'user' as const
          };
          
          setUser(regularUser);
          setRole('user');
          setIsAuthenticated(true);
          localStorage.setItem('wsms_user', JSON.stringify(regularUser));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register a regular user
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: 'user' as const
      };
      
      // Store in localStorage
      const existingUsers = localStorage.getItem('wsms_users_data');
      let users = existingUsers ? JSON.parse(existingUsers) : [];
      users.push(newUser);
      localStorage.setItem('wsms_users_data', JSON.stringify(users));
      
      // Set as current user
      const userWithoutPassword = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      
      setUser(userWithoutPassword);
      setRole('user');
      setIsAuthenticated(true);
      localStorage.setItem('wsms_user', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };
  
  // Register police - only those approved by admin can register
  const registerPolice = async (name: string, email: string, password: string, badgeId: string): Promise<boolean> => {
    try {
      // Check if this police badge ID is in the approved registry
      if (!policeRegistry[badgeId]) {
        return false; // Not approved by admin
      }
      
      const newPolice = {
        id: `police-${Date.now()}`,
        name,
        email,
        password,
        badgeId,
        role: 'police' as const
      };
      
      // Store in localStorage
      const existingPolice = localStorage.getItem('wsms_police_data');
      let policeUsers = existingPolice ? JSON.parse(existingPolice) : [];
      policeUsers.push(newPolice);
      localStorage.setItem('wsms_police_data', JSON.stringify(policeUsers));
      
      // Set as current user
      const policeWithoutPassword = {
        id: newPolice.id,
        name: newPolice.name,
        email: newPolice.email,
        role: newPolice.role
      };
      
      setUser(policeWithoutPassword);
      setRole('police');
      setIsAuthenticated(true);
      localStorage.setItem('wsms_user', JSON.stringify(policeWithoutPassword));
      return true;
    } catch (error) {
      console.error("Police registration error:", error);
      return false;
    }
  };
  
  // Register admin - only once
  const registerAdmin = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if admin is already registered
      if (isFirstAdminRegistered) {
        return false; // Admin already registered
      }
      
      const adminData = {
        id: 'admin-1',
        name,
        email,
        password,
        role: 'admin' as const
      };
      
      // Store admin data
      localStorage.setItem('wsms_admin_data', JSON.stringify(adminData));
      localStorage.setItem('wsms_admin_registered', 'true');
      setIsFirstAdminRegistered(true);
      
      // Set as current user
      const adminWithoutPassword = {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role
      };
      
      setUser(adminWithoutPassword);
      setRole('admin');
      setIsAuthenticated(true);
      localStorage.setItem('wsms_user', JSON.stringify(adminWithoutPassword));
      return true;
    } catch (error) {
      console.error("Admin registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('wsms_user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role, 
        isAuthenticated, 
        login, 
        registerUser, 
        registerPolice,
        registerAdmin,
        logout,
        isFirstAdminRegistered
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
