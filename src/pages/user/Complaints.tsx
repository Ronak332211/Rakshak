
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilePlus, Search } from 'lucide-react';
import ComplaintCard from '@/components/dashboard/ComplaintCard';
import { useAuth } from '@/contexts/AuthContext';
import { getComplaintsByUserId, getCategoryById, categories } from '@/data/mockData';

const UserComplaints = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get mock complaints data
  const userComplaints = user ? getComplaintsByUserId(user.id) : [];
  
  // Filter complaints
  const filteredComplaints = userComplaints.filter(complaint => {
    const matchesFilter = filter === 'all' || complaint.status === filter;
    const matchesSearch = searchTerm === '' || 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Complaints</h1>
              <p className="text-gray-600 mt-1">View and manage all your submitted complaints</p>
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
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search complaints..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Complaints</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Complaints List */}
          {filteredComplaints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComplaints.map((complaint) => {
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
            <div className="text-center py-12">
              <FilePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No complaints found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filter !== 'all' 
                  ? "No complaints match your search or filter criteria." 
                  : "You haven't filed any complaints yet."}
              </p>
              <Button 
                className="bg-wsms-primary hover:bg-wsms-primary-dark"
                onClick={() => navigate('/complaints/new')}
              >
                File New Complaint
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserComplaints;
