import React from 'react';
import { Shield, ClipboardList, Users, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PoliceDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-wsms-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-xl font-bold">Rakshak-WomenSafety</h1>
            <span className="bg-blue-700 text-white px-2 py-1 rounded text-xs">Police Portal</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.name}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white border-white hover:bg-blue-700"
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
                  href="/police/dashboard" 
                  className="flex items-center space-x-2 p-2 bg-wsms-primary/10 text-wsms-primary rounded"
                >
                  <Shield className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a 
                  href="/police/complaints" 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>Complaints</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Police Officer Dashboard</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">6 new since last login</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Resolved Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">48</div>
                <p className="text-xs text-muted-foreground mt-1">+2 in the last 24 hours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500 font-semibold">Active now</span> - requires attention
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Complaints */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Recently filed complaints requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Harassment Report #{item + 100}</h3>
                        <p className="text-sm text-gray-500">Filed 2 hours ago by Sarah Johnson</p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm mt-2">
                      Reported incident at Central Park, requesting immediate assistance.
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="mr-2">View Details</Button>
                      <Button size="sm">Take Action</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => navigate('/police/complaints')}>
                  View All Complaints
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PoliceDashboard; 