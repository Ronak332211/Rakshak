import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRegisterForm = () => {
  const { registerAdmin, isFirstAdminRegistered } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // If admin is already registered, redirect to login
  useEffect(() => {
    if (isFirstAdminRegistered) {
      navigate('/admin/login');
    }
  }, [isFirstAdminRegistered, navigate]);
  
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
      const success = await registerAdmin(formData.name, formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Admin Registration successful!",
          description: "Your admin account has been created.",
          variant: "default",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Registration failed",
          description: "Unable to create admin account. An admin may already be registered.",
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
          You are registering as the first administrator of the system. Only one admin account can be created.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name"
          type="text" 
          placeholder="Admin Name" 
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
          placeholder="admin@example.com" 
          value={formData.email}
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
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating admin account...</>
          ) : (
            'Create admin account'
          )}
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already registered as admin?{' '}
          <a href="/admin/login" className="text-wsms-primary hover:underline">
            Sign in as Admin
          </a>
        </p>
      </div>
    </form>
  );
};

export default AdminRegisterForm; 