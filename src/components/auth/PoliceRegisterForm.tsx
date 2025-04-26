import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PoliceRegisterForm = () => {
  const { registerPolice } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    badgeId: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await registerPolice(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.badgeId
      );
      
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Your police account has been created.",
          variant: "default",
        });
        navigate('/police/dashboard');
      } else {
        toast({
          title: "Registration failed",
          description: "Unable to create your police account. Your badge ID may not be approved by the admin.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An error occurred during registration. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <p className="text-sm text-blue-800">
          Registration requires a valid police badge ID that has been pre-approved by the system administrator.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name"
          type="text" 
          placeholder="Officer Name" 
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder="officer@police.gov" 
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="badgeId">Badge ID</Label>
        <Input 
          id="badgeId" 
          name="badgeId"
          type="text" 
          placeholder="PD12345" 
          value={formData.badgeId}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          name="confirmPassword"
          type="password" 
          placeholder="••••••••" 
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="pt-2">
        <Button type="submit" className="w-full bg-wsms-primary hover:bg-wsms-primary-dark" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating police account...</>
          ) : (
            'Create police account'
          )}
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have a police account?{' '}
          <a href="/police/login" className="text-wsms-primary hover:underline">
            Sign in here
          </a>
        </p>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          For testing purposes, use badge ID: "PD12345" (this would normally be pre-approved by the admin)
        </p>
      </div>
    </form>
  );
};

export default PoliceRegisterForm; 