
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getGuardiansByUserId, Guardian } from '@/data/mockData';
import GuardianCard from '@/components/dashboard/GuardianCard';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Guardians = () => {
  const { user } = useAuth();
  
  // Get mock guardians data
  const [guardians, setGuardians] = useState(user ? getGuardiansByUserId(user.id) : []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGuardian, setCurrentGuardian] = useState<Guardian | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phoneNumber: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGuardian = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo, we'll just add to the state
      const newGuardian: Guardian = {
        id: `guard-${Date.now()}`,
        userId: user?.id || 'user-1',
        name: formData.name,
        relationship: formData.relationship,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGuardians(prev => [...prev, newGuardian]);
      toast({
        title: "Guardian added",
        description: `${formData.name} has been added as an emergency guardian.`,
      });
      
      // Reset form
      setFormData({
        name: '',
        relationship: '',
        phoneNumber: '',
        email: '',
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add guardian. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!currentGuardian) return;
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo, we'll just update the state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGuardians(prev => prev.map(g => 
        g.id === currentGuardian.id ? { ...g, ...formData } : g
      ));
      
      toast({
        title: "Guardian updated",
        description: `${formData.name}'s information has been updated.`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update guardian. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGuardian = async () => {
    if (!currentGuardian) return;
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo, we'll just update the state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGuardians(prev => prev.filter(g => g.id !== currentGuardian.id));
      
      toast({
        title: "Guardian removed",
        description: `${currentGuardian.name} has been removed from your guardians.`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove guardian. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setCurrentGuardian(null);
    }
  };

  const openEditDialog = (guardian: Guardian) => {
    setCurrentGuardian(guardian);
    setFormData({
      name: guardian.name,
      relationship: guardian.relationship,
      phoneNumber: guardian.phoneNumber,
      email: guardian.email,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (guardianId: string) => {
    const guardian = guardians.find(g => g.id === guardianId);
    if (guardian) {
      setCurrentGuardian(guardian);
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Emergency Guardians</h1>
              <p className="text-gray-600 mt-1">Manage your emergency contacts who can be notified in case of urgency</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="bg-wsms-primary hover:bg-wsms-primary-dark flex items-center gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4" /> Add Guardian
              </Button>
            </div>
          </div>
          
          {/* Guardians List */}
          {guardians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guardians.map(guardian => (
                <GuardianCard 
                  key={guardian.id} 
                  guardian={guardian}
                  onDelete={openDeleteDialog}
                  onEdit={openEditDialog}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No guardians added yet</h3>
              <p className="text-gray-500 mb-6">
                Add emergency contacts who can be notified in case of urgency.
              </p>
              <Button 
                className="bg-wsms-primary hover:bg-wsms-primary-dark"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add Your First Guardian
              </Button>
            </div>
          )}
          
          {/* Information Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-medium text-blue-800 mb-2">Why add guardians?</h3>
            <p className="text-blue-700 text-sm">
              Guardians are trusted contacts who can be automatically notified during emergencies.
              They will receive alerts with your location and incident details when you mark a 
              complaint as urgent or trigger an SOS alert.
            </p>
          </div>
        </div>
      </main>
      
      {/* Add Guardian Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Guardian</DialogTitle>
            <DialogDescription>
              Add a trusted contact who can be notified in emergencies.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                name="relationship"
                placeholder="Family / Friend / Colleague"
                value={formData.relationship}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="123-456-7890"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-wsms-primary hover:bg-wsms-primary-dark"
              onClick={handleAddGuardian}
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
              ) : (
                'Add Guardian'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Guardian Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Guardian</DialogTitle>
            <DialogDescription>
              Update the contact information for this guardian.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-relationship">Relationship</Label>
              <Input
                id="edit-relationship"
                name="relationship"
                placeholder="Family / Friend / Colleague"
                value={formData.relationship}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phoneNumber">Phone Number</Label>
              <Input
                id="edit-phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="123-456-7890"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-wsms-primary hover:bg-wsms-primary-dark"
              onClick={handleEditSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Guardian Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Guardian</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {currentGuardian?.name} from your guardians?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteGuardian}
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing...</>
              ) : (
                'Remove Guardian'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Guardians;
