import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminRegister from "./pages/auth/AdminRegister";
import PoliceLogin from "./pages/auth/PoliceLogin";
import PoliceRegister from "./pages/auth/PoliceRegister";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserComplaints from "./pages/user/Complaints";
import NewComplaint from "./pages/user/NewComplaint";
import Guardians from "./pages/user/Guardians";

// Police Pages
import PoliceDashboard from "./pages/police/Dashboard";
import PoliceComplaints from "./pages/police/Complaints";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminComplaints from "./pages/admin/Complaints";
import AdminUsers from "./pages/admin/Users";
import AdminPolice from "./pages/admin/Police";

// Protected Route Component
const ProtectedRoute = ({ 
  element, 
  allowedRoles, 
  redirectPath = "/login" 
}: { 
  element: React.ReactNode; 
  allowedRoles?: Array<'user' | 'police' | 'admin' | null>;
  redirectPath?: string;
}) => {
  const { isAuthenticated, role } = useAuth();
  
  const isAuthorized = isAuthenticated && 
    (!allowedRoles || allowedRoles.includes(role));
  
  return isAuthorized ? <>{element}</> : <Navigate to={redirectPath} replace />;
};

// Move this inside the App component to ensure it's only initialized during rendering
const AppRoutes = () => {
  const { isFirstAdminRegistered } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      
      {/* Auth Routes for Users */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Auth Routes for Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/register" 
        element={
          isFirstAdminRegistered ? 
          <Navigate to="/admin/login" replace /> : 
          <AdminRegister />
        } 
      />
      
      {/* Auth Routes for Police */}
      <Route path="/police/login" element={<PoliceLogin />} />
      <Route path="/police/register" element={<PoliceRegister />} />
      
      {/* User Routes */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute element={<UserDashboard />} allowedRoles={['user']} />} 
      />
      <Route 
        path="/complaints" 
        element={<ProtectedRoute element={<UserComplaints />} allowedRoles={['user']} />} 
      />
      <Route 
        path="/complaints/new" 
        element={<ProtectedRoute element={<NewComplaint />} allowedRoles={['user']} />} 
      />
      <Route 
        path="/guardians" 
        element={<ProtectedRoute element={<Guardians />} allowedRoles={['user']} />} 
      />
      
      {/* Police Routes */}
      <Route 
        path="/police/dashboard" 
        element={<ProtectedRoute element={<PoliceDashboard />} allowedRoles={['police']} redirectPath="/police/login" />} 
      />
      <Route 
        path="/police/complaints" 
        element={<ProtectedRoute element={<PoliceComplaints />} allowedRoles={['police']} redirectPath="/police/login" />} 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} redirectPath="/admin/login" />} 
      />
      <Route 
        path="/admin/complaints" 
        element={<ProtectedRoute element={<AdminComplaints />} allowedRoles={['admin']} redirectPath="/admin/login" />} 
      />
      <Route 
        path="/admin/users" 
        element={<ProtectedRoute element={<AdminUsers />} allowedRoles={['admin']} redirectPath="/admin/login" />} 
      />
      <Route 
        path="/admin/police" 
        element={<ProtectedRoute element={<AdminPolice />} allowedRoles={['admin']} redirectPath="/admin/login" />} 
      />
      
      {/* NotFound Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Initialize QueryClient inside the component to ensure React context
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
