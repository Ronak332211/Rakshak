import React, { useState } from 'react';
import { Shield, ClipboardList, Users, UserCheck, UserCog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [newBadgeId, setNewBadgeId] = useState('');
  const [officerName, setOfficerName] = useState('');
  
  // Mock function to approve a police officer badge ID
  const approvePoliceOfficer = () => {
    if (!newBadgeId || !officerName) {
      toast({
        title: "Error",
        description: "Please provide both badge ID and officer name",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would update a database
    // For our demo, we'll store in localStorage
    const policeRegistry = JSON.parse(localStorage.getItem('wsms_police_registry') || '{}');
    policeRegistry[newBadgeId] = true;
    localStorage.setItem('wsms_police_registry', JSON.stringify(policeRegistry));
    
    toast({
      title: "Success",
      description: `Police Officer ${officerName} with Badge ID ${newBadgeId} approved.`,
      variant: "default",
    });
    
    setNewBadgeId('');
    setOfficerName('');
  };
  
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
      
      {/* Sidebar and Main Content */}
      <div className="container mx-auto flex mt-6 px-4 gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-lg shadow-md p-4 h-min">
          <nav>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/admin/dashboard" 
                  className="flex items-center space-x-2 p-2 bg-wsms-primary/10 text-wsms-primary rounded"
                >
                  <Shield className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a 
                  href="/admin/complaints" 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>Complaints</span>
                </a>
              </li>
              <li>
                <a 
                  href="/admin/users" 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </a>
              </li>
              <li>
                <a 
                  href="/admin/police" 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                >
                  <UserCheck className="h-5 w-5" />
                  <span>Police Officers</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">256</div>
                <p className="text-xs text-muted-foreground mt-1">+12 new this week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Police Officers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">3 pending approval</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">128</div>
                <p className="text-xs text-muted-foreground mt-1">42 currently active</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">Good</div>
                <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Police Officer Approval */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Police Officer Registration Approval</CardTitle>
              <CardDescription>Approve new police officers to allow them to register</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badgeId">Police Badge ID</Label>
                  <Input
                    id="badgeId"
                    placeholder="e.g. PD12345"
                    value={newBadgeId}
                    onChange={(e) => setNewBadgeId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="officerName">Officer Name</Label>
                  <Input
                    id="officerName"
                    placeholder="e.g. Officer John Smith"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                  />
                </div>
              </div>
              <Button className="mt-4" onClick={approvePoliceOfficer}>
                Approve Officer
              </Button>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Recently Approved Officers</h3>
                <div className="border rounded-md">
                  <div className="bg-gray-100 p-3 text-sm font-medium grid grid-cols-3">
                    <div>Badge ID</div>
                    <div>Officer Name</div>
                    <div>Status</div>
                  </div>
                  {/* Just display some mock data */}
                  <div className="p-3 text-sm grid grid-cols-3 border-t">
                    <div>PD12345</div>
                    <div>John Smith</div>
                    <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span></div>
                  </div>
                  <div className="p-3 text-sm grid grid-cols-3 border-t">
                    <div>PD54321</div>
                    <div>Jane Wilson</div>
                    <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate('/admin/users')} 
                  className="flex items-center justify-center gap-2 h-20"
                >
                  <Users className="h-5 w-5" />
                  <span>Manage Users</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/admin/complaints')} 
                  className="flex items-center justify-center gap-2 h-20"
                  variant="outline"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>View Complaints</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/admin/police')} 
                  className="flex items-center justify-center gap-2 h-20"
                  variant="outline"
                >
                  <UserCog className="h-5 w-5" />
                  <span>Manage Police Officers</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 