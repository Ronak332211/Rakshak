
import React from 'react';
import { Complaint, Category } from '@/data/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { Calendar, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface ComplaintCardProps {
  complaint: Complaint;
  category: Category;
  onViewDetails?: () => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ 
  complaint, 
  category,
  onViewDetails 
}) => {
  const formattedDate = formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-wsms-secondary/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{complaint.title}</CardTitle>
          <StatusBadge status={complaint.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Filed {formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{complaint.location}</span>
          </div>

          <div className="bg-gray-50 px-3 py-2 rounded-md mt-3">
            <p className="text-sm line-clamp-2">{complaint.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-wsms-primary/10 text-wsms-primary mr-2">
            <span className="sr-only">{category.name}</span>
            <span className="text-xs">{category.name.charAt(0)}</span>
          </div>
          <span className="text-sm font-medium">{category.name}</span>
        </div>
        
        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ComplaintCard;
