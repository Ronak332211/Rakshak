
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
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
      const success = await register(formData.name, formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Your account has been created.",
          variant: "default",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Registration failed",
          description: "Unable to create your account. Please try again.",
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
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name"
          type="text" 
          placeholder="Jane Doe" 
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
          placeholder="jane.doe@example.com" 
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          name="phone"
          type="tel" 
          placeholder="123-456-7890" 
          value={formData.phone}
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
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
          ) : (
            'Create account'
          )}
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-wsms-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
