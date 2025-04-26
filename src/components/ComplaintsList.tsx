import React from 'react';
import { Complaint } from '@/lib/supabaseTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface ComplaintsListProps {
  complaints: Complaint[];
  isLoading?: boolean;
}

export function ComplaintsList({ complaints, isLoading }: ComplaintsListProps) {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading complaints...</div>;
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No complaints found. Submit a new complaint to see it here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} />
      ))}
    </div>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const timeAgo = complaint.created_at 
    ? formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })
    : 'Unknown time';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{complaint.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{timeAgo}</span>
          <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{complaint.description}</p>
        {complaint.location && (
          <div className="mt-2 text-xs text-gray-500">
            <span>📍 {complaint.location}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {complaint.category && (
          <Badge variant="outline">{complaint.category.name}</Badge>
        )}
      </CardFooter>
    </Card>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
} 