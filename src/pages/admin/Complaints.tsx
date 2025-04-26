import React from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminComplaints = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-wsms-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-xl font-bold">Rakshak-WomenSafety</h1>
            <span className="bg-purple-700 text-white px-2 py-1 rounded text-xs">Admin Portal</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.name}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white border-white hover:bg-purple-700"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Complaints Management</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600 mb-4">
            This is a placeholder for the Admin Complaints page.
          </p>
          <p className="text-gray-500">
            Here, administrators would be able to view and manage all complaints in the system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints; 