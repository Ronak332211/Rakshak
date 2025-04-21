
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

const StatCard = ({ icon, title, value, description, className }: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="mr-4 p-3 rounded-full bg-wsms-secondary text-wsms-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value}</h4>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
