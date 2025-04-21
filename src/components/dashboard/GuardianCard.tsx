
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Guardian } from '@/data/mockData';
import { Phone, Mail, UserCircle, Trash2 } from 'lucide-react';

interface GuardianCardProps {
  guardian: Guardian;
  onDelete?: (id: string) => void;
  onEdit?: (guardian: Guardian) => void;
}

const GuardianCard: React.FC<GuardianCardProps> = ({ guardian, onDelete, onEdit }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-wsms-secondary flex items-center justify-center mr-4">
            <UserCircle className="h-8 w-8 text-wsms-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{guardian.name}</h3>
            <p className="text-sm text-gray-500">{guardian.relationship}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <span>{guardian.phoneNumber}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span>{guardian.email}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit && onEdit(guardian)}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete && onDelete(guardian.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuardianCard;
