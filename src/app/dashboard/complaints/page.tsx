'use client';

import { useState, useEffect } from 'react';
import { getUserComplaints } from '@/lib/supabase';
import { ComplaintsList } from '@/components/ComplaintsList';
import { Complaint } from '@/lib/supabaseTypes';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function loadComplaints() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userComplaints = await getUserComplaints(user.id);
        setComplaints(userComplaints);
      } catch (error) {
        console.error('Error loading complaints:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadComplaints();
  }, [user]);

  const handleAddComplaint = () => {
    router.push('/dashboard/complaints/new');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <Button onClick={handleAddComplaint}>
          <Plus className="mr-2 h-4 w-4" /> New Complaint
        </Button>
      </div>
      
      <ComplaintsList complaints={complaints} isLoading={isLoading} />
    </div>
  );
} 