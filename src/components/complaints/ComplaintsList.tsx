import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchComplaintsByUserId } from '@/lib/supabaseService';
import { Complaint } from '@/lib/supabaseTypes';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500';
    case 'in progress':
      return 'bg-blue-500';
    case 'resolved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ComplaintsList = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComplaints = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchComplaintsByUserId(user.id);
        setComplaints(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
        setError('Failed to load complaints. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-4">No complaints found</h3>
        <p className="text-muted-foreground mb-6">You haven't submitted any complaints yet.</p>
        <Link to="/user/complaints/new">
          <Button>File a New Complaint</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Complaints</h2>
        <Link to="/user/complaints/new">
          <Button>File a New Complaint</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{complaint.title}</CardTitle>
                <Badge className={getStatusColor(complaint.status)}>
                  {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between mt-1">
                <span>Category: {complaint.category?.name || 'Unknown'}</span>
                <span>{formatDate(complaint.created_at)}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-3">
              <p className="text-sm line-clamp-2">{complaint.description}</p>
              {complaint.location && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span>Location: {complaint.location}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-1">
              <Link to={`/user/complaints/${complaint.id}`} className="w-full">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsList; 