
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplaintForm from '@/components/complaints/ComplaintForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NewComplaint = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-600 hover:text-wsms-primary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </div>
          
          {/* Form Card */}
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">File a New Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <ComplaintForm />
            </CardContent>
          </Card>
          
          {/* Safety Tips */}
          <div className="max-w-3xl mx-auto mt-8">
            <h3 className="text-lg font-semibold mb-4">Important Safety Tips:</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>If you're in immediate danger, contact emergency services directly at 911.</li>
                <li>Be as specific as possible when describing the incident to help authorities.</li>
                <li>Include any relevant details such as time, location, and descriptions of individuals involved.</li>
                <li>If possible, document evidence such as photos, videos, or screenshots.</li>
                <li>Your complaint information is kept confidential and secure.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewComplaint;
