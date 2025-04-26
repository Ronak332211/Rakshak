import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, FileText, UserCircle, PhoneCall, Clock, Lock, Users, UserCog } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      switch(role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'police':
          navigate('/police/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-wsms-secondary to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-wsms-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Rakshak-Women Safety
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600">
              A secure platform where women can report incidents, track complaint status, and stay connected with authorities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-wsms-primary hover:bg-wsms-primary-dark text-white font-medium px-8"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-wsms-primary text-wsms-primary hover:bg-wsms-secondary"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Portal Selection Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Portal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* User Portal */}
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-wsms-primary flex flex-col">
                <div className="bg-wsms-secondary/50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <UserCircle className="h-7 w-7 text-wsms-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">User Portal</h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Register or login as a user to file complaints, add emergency contacts, and access safety resources.
                </p>
                <div className="flex gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-wsms-primary text-wsms-primary"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                  <Button 
                    className="flex-1 bg-wsms-primary"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </div>
              </div>
              
              {/* Police Portal */}
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 flex flex-col">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Police Portal</h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  For authorized police officers to manage and respond to complaints and emergency alerts.
                </p>
                <div className="flex gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-blue-600 text-blue-600"
                    onClick={() => navigate('/police/register')}
                  >
                    Register
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600"
                    onClick={() => navigate('/police/login')}
                  >
                    Login
                  </Button>
                </div>
              </div>
              
              {/* Admin Portal */}
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600 flex flex-col">
                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <UserCog className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Admin Portal</h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  System administration for managing users, police officers, and overseeing the entire platform.
                </p>
                <div className="flex gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-purple-600 text-purple-600"
                    onClick={() => navigate('/admin/register')}
                  >
                    Register
                  </Button>
                  <Button 
                    className="flex-1 bg-purple-600"
                    onClick={() => navigate('/admin/login')}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-wsms-secondary/50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-wsms-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">File Complaints</h3>
                <p className="text-gray-600">
                  Submit complaints about incidents with detailed information and track their status.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-wsms-secondary/50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <UserCircle className="h-7 w-7 text-wsms-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Guardian Management</h3>
                <p className="text-gray-600">
                  Add and manage emergency contacts who can be notified in case of emergencies.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-wsms-secondary/50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-wsms-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Status Updates</h3>
                <p className="text-gray-600">
                  Get real-time updates on your complaint status as authorities process it.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-wsms-secondary/50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <PhoneCall className="h-7 w-7 text-wsms-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Emergency Support</h3>
                <p className="text-gray-600">
                  Access emergency services and helpline numbers directly from the platform.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-wsms-secondary/50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-7 w-7 text-wsms-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
                <p className="text-gray-600">
                  End-to-end encryption and privacy protections for all user data and complaints.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-wsms-secondary/50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-wsms-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Police Coordination</h3>
                <p className="text-gray-600">
                  Direct communication with police departments for faster response to incidents.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-wsms-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our platform today to access all features and ensure your safety.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-wsms-primary hover:bg-wsms-secondary px-8"
              onClick={handleGetStarted}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Join Now'}
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
