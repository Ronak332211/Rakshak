import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-wsms-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <Link to="/" className="text-xl font-bold">Rakshak-Women Safety</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-wsms-secondary transition-colors">Home</Link>
            
            {isAuthenticated && user?.role === 'user' && (
              <>
                <Link to="/dashboard" className="hover:text-wsms-secondary transition-colors">Dashboard</Link>
                <Link to="/complaints" className="hover:text-wsms-secondary transition-colors">My Complaints</Link>
                <Link to="/guardians" className="hover:text-wsms-secondary transition-colors">Guardians</Link>
              </>
            )}
            
            {isAuthenticated && user?.role === 'police' && (
              <>
                <Link to="/police/dashboard" className="hover:text-wsms-secondary transition-colors">Dashboard</Link>
                <Link to="/police/complaints" className="hover:text-wsms-secondary transition-colors">Assigned Cases</Link>
              </>
            )}
            
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="hover:text-wsms-secondary transition-colors">Dashboard</Link>
                <Link to="/admin/complaints" className="hover:text-wsms-secondary transition-colors">Complaints</Link>
                <Link to="/admin/users" className="hover:text-wsms-secondary transition-colors">Users</Link>
                <Link to="/admin/categories" className="hover:text-wsms-secondary transition-colors">Categories</Link>
              </>
            )}

            {!isAuthenticated ? (
              <Link to="/login">
                <Button variant="secondary" className="bg-white text-wsms-primary hover:bg-wsms-secondary">
                  Login / Register
                </Button>
              </Link>
            ) : (
              <Button variant="secondary" className="bg-white text-wsms-primary hover:bg-wsms-secondary flex items-center gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="text-white hover:bg-wsms-primary-dark">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Home</Link>
              
              {isAuthenticated && user?.role === 'user' && (
                <>
                  <Link to="/dashboard" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link to="/complaints" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>My Complaints</Link>
                  <Link to="/guardians" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Guardians</Link>
                </>
              )}
              
              {isAuthenticated && user?.role === 'police' && (
                <>
                  <Link to="/police/dashboard" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link to="/police/complaints" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Assigned Cases</Link>
                </>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link to="/admin/complaints" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Complaints</Link>
                  <Link to="/admin/users" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Users</Link>
                  <Link to="/admin/categories" className="hover:bg-wsms-primary-dark py-2 px-4 rounded" onClick={() => setIsOpen(false)}>Categories</Link>
                </>
              )}

              {!isAuthenticated ? (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-white text-wsms-primary hover:bg-wsms-secondary">
                    Login / Register
                  </Button>
                </Link>
              ) : (
                <Button className="w-full bg-white text-wsms-primary hover:bg-wsms-secondary" onClick={() => {
                  logout();
                  setIsOpen(false);
                }}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
