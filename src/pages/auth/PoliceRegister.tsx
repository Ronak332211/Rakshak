import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PoliceRegisterForm from '@/components/auth/PoliceRegisterForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PoliceRegister = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-wsms-primary mx-auto" />
            <h1 className="text-2xl font-bold mt-2">Rakshak-WomenSafety</h1>
            <p className="text-lg font-medium text-wsms-primary">Police Portal</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Register as Police Officer</CardTitle>
              <CardDescription className="text-center">
                Create a police account to access the system (requires approval)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PoliceRegisterForm />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoliceRegister; 