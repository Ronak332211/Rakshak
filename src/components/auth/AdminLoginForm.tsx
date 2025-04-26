import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminLoginForm = () => {
  const { login, isFirstAdminRegistered } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, 'admin');
      
      if (success) {
        toast({
          title: "Success!",
          description: "You've been logged in as Admin successfully.",
          variant: "default",
        });
        
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid admin credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isFirstAdminRegistered && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            No admin account has been registered yet. Please register as the first admin.
          </p>
          <Button 
            variant="link" 
            className="text-yellow-800 p-0 h-auto font-semibold" 
            onClick={() => navigate('/admin/register')}
          >
            Register as Admin
          </Button>
        </div>
      )}
      
      <div className="space-y-3">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="admin@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full bg-wsms-primary hover:bg-wsms-primary-dark" disabled={isLoading}>
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
        ) : (
          'Sign in as Admin'
        )}
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Not an admin?{' '}
          <a href="/login" className="text-wsms-primary hover:underline">
            User Login
          </a>
          {' | '}
          <a href="/police/login" className="text-wsms-primary hover:underline">
            Police Login
          </a>
        </p>
      </div>
    </form>
  );
};

export default AdminLoginForm; 