import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/lib/supabaseTypes';
import { fetchCategories, createComplaint, uploadEvidence } from '@/lib/supabaseService';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load complaint categories',
          variant: 'destructive',
        });
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          }));
          toast({
            title: 'Location Captured',
            description: 'Your current location has been added to the complaint.',
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your current location. Please enter manually or try again.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to submit a complaint',
        variant: 'destructive',
      });
      return;
    }

    // Validation
    if (!formData.title || !formData.category_id || !formData.description) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload any evidence files
      const evidenceUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const url = await uploadEvidence(file, user.id);
          evidenceUrls.push(url);
        }
      }

      const complaintData = {
        user_id: user.id,
        category_id: formData.category_id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        status: 'pending',
        evidence_urls: evidenceUrls.length > 0 ? evidenceUrls : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await createComplaint(complaintData);

      toast({
        title: 'Complaint Submitted',
        description: 'Your complaint has been successfully submitted.',
      });

      // Navigate to complaints list
      navigate('/user/complaints');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your complaint. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Complaint Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Brief title of your complaint"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select onValueChange={handleSelectChange} value={formData.category_id}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
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
        <div className="flex space-x-2">
          <Input
            id="location"
            name="location"
            placeholder="Where did this occur?"
            value={formData.location}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="button" onClick={getCurrentLocation} variant="outline">
            Get Location
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide details about what happened"
          value={formData.description}
          onChange={handleInputChange}
          className="min-h-[150px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidence">Evidence (Optional)</Label>
        <Input
          id="evidence"
          type="file"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        {selectedFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Selected files:</p>
            <ul className="text-sm">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex justify-between items-center py-1">
                  <span>{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </Button>
      </div>
    </form>
  );
};

export default ComplaintForm;
