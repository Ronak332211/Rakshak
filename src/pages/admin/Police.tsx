import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, Search, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AdminPolice = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [newBadgeId, setNewBadgeId] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [approvedOfficers, setApprovedOfficers] = useState<{badgeId: string, name: string}[]>([]);
  const [registeredOfficers, setRegisteredOfficers] = useState<any[]>([]);
  
  // Load approved officers and registered officers on component mount
  useEffect(() => {
    // Load approved badge IDs
    const policeRegistry = JSON.parse(localStorage.getItem('wsms_police_registry') || '{}');
    const officers = Object.keys(policeRegistry).map(badgeId => ({
      badgeId,
      name: `Officer ${badgeId}`, // In a real app, we'd have the officer name stored
      status: 'approved'
    }));
    setApprovedOfficers(officers);
    
    // Load registered police officers
    const policeData = JSON.parse(localStorage.getItem('wsms_police_data') || '[]');
    setRegisteredOfficers(policeData);
  }, []);
  
  // Approve a new police officer
  const approvePoliceOfficer = () => {
    if (!newBadgeId || !officerName) {
      toast({
        title: "Error",
        description: "Please provide both badge ID and officer name",
        variant: "destructive",
      });
      return;
    }
    
    // Update localStorage
    const policeRegistry = JSON.parse(localStorage.getItem('wsms_police_registry') || '{}');
    policeRegistry[newBadgeId] = true;
    localStorage.setItem('wsms_police_registry', JSON.stringify(policeRegistry));
    
    // Update state
    setApprovedOfficers([...approvedOfficers, { badgeId: newBadgeId, name: officerName }]);
    
    toast({
      title: "Success",
      description: `Police Officer ${officerName} with Badge ID ${newBadgeId} approved.`,
      variant: "default",
    });
    
    setNewBadgeId('');
    setOfficerName('');
  };
  
  // Remove an approved badge ID
  const removeApproval = (badgeId: string) => {
    // Update localStorage
    const policeRegistry = JSON.parse(localStorage.getItem('wsms_police_registry') || '{}');
    delete policeRegistry[badgeId];
    localStorage.setItem('wsms_police_registry', JSON.stringify(policeRegistry));
    
    // Update state
    setApprovedOfficers(approvedOfficers.filter(officer => officer.badgeId !== badgeId));
    
    toast({
      title: "Removed",
      description: `Badge ID ${badgeId} has been removed from approved list.`,
      variant: "default",
    });
  };
  
  // Filter officers based on search term
  const filteredOfficers = registeredOfficers.filter(officer => 
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (officer.badgeId && officer.badgeId.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
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
                  <Shield className="h-5 w-5" />
                  <span>Complaints</span>
                </a>
              </li>
              <li>
                <a 
                  href="/admin/users" 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                >
                  <Shield className="h-5 w-5" />
                  <span>Users</span>
                </a>
              </li>
              <li>
                <a 
                  href="/admin/police" 
                  className="flex items-center space-x-2 p-2 bg-wsms-primary/10 text-wsms-primary rounded"
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
          <h2 className="text-2xl font-bold mb-6">Manage Police Officers</h2>
          
          {/* Add New Police Badge ID for Approval */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Approve New Police Officer</CardTitle>
              <CardDescription>
                Add police badge IDs to allow officers to register in the system
              </CardDescription>
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
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Officer
              </Button>
            </CardContent>
          </Card>
          
          {/* Approved Badge IDs */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Approved Badge IDs</CardTitle>
              <CardDescription>
                Police officers with these badge IDs can register in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvedOfficers.length === 0 ? (
                <p className="text-gray-500 text-sm">No approved badge IDs yet</p>
              ) : (
                <div className="border rounded-md">
                  <div className="bg-gray-100 p-3 text-sm font-medium grid grid-cols-3">
                    <div>Badge ID</div>
                    <div>Officer Name</div>
                    <div>Actions</div>
                  </div>
                  {approvedOfficers.map((officer, index) => (
                    <div key={index} className="p-3 text-sm grid grid-cols-3 border-t">
                      <div>{officer.badgeId}</div>
                      <div>{officer.name}</div>
                      <div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 p-1 h-8"
                          onClick={() => removeApproval(officer.badgeId)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Registered Police Officers */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Police Officers</CardTitle>
              <CardDescription>
                Officers who have registered accounts in the system
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search officers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {registeredOfficers.length === 0 ? (
                <p className="text-gray-500 text-sm">No police officers have registered yet</p>
              ) : (
                <div className="border rounded-md">
                  <div className="bg-gray-100 p-3 text-sm font-medium grid grid-cols-4">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Badge ID</div>
                    <div>Status</div>
                  </div>
                  {filteredOfficers.map((officer, index) => (
                    <div key={index} className="p-3 text-sm grid grid-cols-4 border-t">
                      <div>{officer.name}</div>
                      <div>{officer.email}</div>
                      <div>{officer.badgeId}</div>
                      <div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredOfficers.length === 0 && (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No matching officers found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminPolice; 