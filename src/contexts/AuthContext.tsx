
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
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('wsms_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string, userRole: UserRole): Promise<boolean> => {
    // This is a mock implementation for demonstration
    try {
      // In a real application, this would verify credentials against a backend
      
      // For demo purposes, we'll just check some mock credentials
      if (userRole === 'admin' && email === 'admin@example.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin' as const
        };
        
        setUser(adminUser);
        setRole('admin');
        setIsAuthenticated(true);
        localStorage.setItem('wsms_user', JSON.stringify(adminUser));
        return true;
      } 
      else if (userRole === 'police' && email === 'police@example.com' && password === 'police123') {
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
      else if (userRole === 'user' && email === 'user@example.com' && password === 'user123') {
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
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real application, this would send the registration data to a backend
      
      // For demo purposes, we'll just create a new user object
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: 'user' as const
      };
      
      setUser(newUser);
      setRole('user');
      setIsAuthenticated(true);
      localStorage.setItem('wsms_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
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
        register, 
        logout 
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
