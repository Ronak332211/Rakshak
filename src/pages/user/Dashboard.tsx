
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FilePlus, 
  Shield, 
  Users, 
  Bell 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import ComplaintCard from '@/components/dashboard/ComplaintCard';
import { getComplaintsByUserId, getCategoryById } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get mock complaints data
  const userComplaints = user ? getComplaintsByUserId(user.id) : [];
  
  // Stats counts
  const totalComplaints = userComplaints.length;
  const pendingComplaints = userComplaints.filter(c => c.status === 'pending').length;
  const inProgressComplaints = userComplaints.filter(c => c.status === 'in-progress').length;
  const resolvedComplaints = userComplaints.filter(c => c.status === 'resolved').length;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'User'}!</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="bg-wsms-primary hover:bg-wsms-primary-dark flex items-center gap-2"
                onClick={() => navigate('/complaints/new')}
              >
                <FilePlus className="h-4 w-4" /> File New Complaint
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<Shield className="h-5 w-5" />}
              title="Total Complaints"
              value={totalComplaints}
            />
            <StatCard 
              icon={<Clock className="h-5 w-5" />}
              title="Pending"
              value={pendingComplaints}
              className="border-yellow-200"
            />
            <StatCard 
              icon={<AlertTriangle className="h-5 w-5" />}
              title="In Progress"
              value={inProgressComplaints}
              className="border-blue-200"
            />
            <StatCard 
              icon={<CheckCircle className="h-5 w-5" />}
              title="Resolved"
              value={resolvedComplaints}
              className="border-green-200"
            />
          </div>
          
          {/* Recent Complaints */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Complaints</h2>
              <Button variant="ghost" onClick={() => navigate('/complaints')}>
                View All
              </Button>
            </div>
            
            {userComplaints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userComplaints.slice(0, 3).map((complaint) => {
                  const category = getCategoryById(complaint.categoryId);
                  return category ? (
                    <ComplaintCard 
                      key={complaint.id}
                      complaint={complaint}
                      category={category}
                      onViewDetails={() => navigate(`/complaints/${complaint.id}`)}
                    />
                  ) : null;
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FilePlus className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-1">No complaints yet</h3>
                  <p className="text-gray-500 mb-4">You haven't filed any complaints yet</p>
                  <Button 
                    className="bg-wsms-primary hover:bg-wsms-primary-dark"
                    onClick={() => navigate('/complaints/new')}
                  >
                    File Your First Complaint
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:border-wsms-primary cursor-pointer transition-colors" onClick={() => navigate('/complaints/new')}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <FilePlus className="h-10 w-10 text-wsms-primary mb-4" />
                  <h3 className="font-medium">File New Complaint</h3>
                </CardContent>
              </Card>
              
              <Card className="hover:border-wsms-primary cursor-pointer transition-colors" onClick={() => navigate('/guardians')}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Users className="h-10 w-10 text-wsms-primary mb-4" />
                  <h3 className="font-medium">Manage Guardians</h3>
                </CardContent>
              </Card>
              
              <Card className="hover:border-wsms-primary cursor-pointer transition-colors" onClick={() => navigate('/profile')}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Shield className="h-10 w-10 text-wsms-primary mb-4" />
                  <h3 className="font-medium">Safety Resources</h3>
                </CardContent>
              </Card>
              
              <Card className="hover:border-wsms-primary cursor-pointer transition-colors" onClick={() => navigate('/notifications')}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Bell className="h-10 w-10 text-wsms-primary mb-4" />
                  <h3 className="font-medium">Notifications</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
