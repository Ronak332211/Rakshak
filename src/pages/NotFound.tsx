import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Page Not Found</h2>
          
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="flex items-center justify-center gap-2"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
