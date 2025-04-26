import express from 'express';
import User from '../models/user.model';
import Guardian from '../models/guardian.model';
import { authenticate, authorize } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';
import { sendSOSEmail } from '../services/email.service';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('guardians');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { name, phone, address, emergencyContact, profilePicture } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address,
        emergencyContact,
        profilePicture
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user location
router.post('/location', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'Location updated successfully',
      location: user.currentLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send SOS alert
router.post('/sos', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Get user with location
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has location
    if (!user.currentLocation) {
      return res.status(400).json({ message: 'Location not available. Please enable location sharing.' });
    }
    
    // Get user's guardians
    const guardians = await Guardian.find({ user: user._id });
    
    if (guardians.length === 0) {
      return res.status(400).json({ message: 'No guardians found. Please add guardians in your profile.' });
    }
    
    // Send SOS email to all guardians
    const result = await sendSOSEmail(
      user, 
      guardians, 
      { 
        latitude: user.currentLocation.latitude,
        longitude: user.currentLocation.longitude
      }
    );
    
    // Also notify admin (can be implemented with notifications)
    
    res.json({ 
      message: 'SOS alert sent successfully',
      alertSent: result.success,
      guardiansNotified: guardians.length
    });
  } catch (error) {
    console.error('SOS alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 