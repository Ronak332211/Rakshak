
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { categories } from '@/data/mockData';
import { MapPin, Loader2 } from 'lucide-react';

const ComplaintForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    location: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call to submit the complaint
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Complaint filed successfully",
        description: "Your complaint has been submitted. You can track its status from your dashboard.",
        variant: "default",
      });
      
      navigate('/complaints');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: "Failed to submit your complaint. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ 
          ...prev, 
          location: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}` 
        }));
        
        toast({
          title: "Location detected",
          description: "Your current location has been added to the complaint",
        });
      },
      (error) => {
        toast({
          title: "Location error",
          description: error.message,
          variant: "destructive",
        });
      }
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title of Complaint</Label>
        <Input
          id="title"
          name="title"
          placeholder="Brief title describing the incident"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={handleSelectChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            name="location"
            placeholder="Where did the incident occur?"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={handleGetCurrentLocation}
            className="flex items-center gap-1"
          >
            <MapPin className="h-4 w-4" /> Current
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide detailed information about what happened"
          rows={5}
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="pt-2 flex justify-end">
        <Button type="button" variant="outline" className="mr-2" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-wsms-primary hover:bg-wsms-primary-dark" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
          ) : (
            'Submit Complaint'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ComplaintForm;
