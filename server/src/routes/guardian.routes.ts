import express from 'express';
import Guardian from '../models/guardian.model';
import User from '../models/user.model';
import { authenticate } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get all guardians for a user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const guardians = await Guardian.find({ user: req.user.id });
    
    res.json({ guardians });
  } catch (error) {
    console.error('Get guardians error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new guardian
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { name, relationship, phone, email, address } = req.body;
    
    // Validate required fields
    if (!name || !relationship || !phone || !email) {
      return res.status(400).json({ message: 'Name, relationship, phone, and email are required' });
    }
    
    // Create new guardian
    const guardian = new Guardian({
      name,
      relationship,
      phone,
      email,
      address,
      user: req.user.id
    });
    
    await guardian.save();
    
    // Update user's guardians array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { guardians: guardian._id } }
    );
    
    res.status(201).json({
      message: 'Guardian added successfully',
      guardian
    });
  } catch (error) {
    console.error('Add guardian error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a guardian
router.put('/:guardianId', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const guardianId = req.params.guardianId;
    const { name, relationship, phone, email, address } = req.body;
    
    // Find guardian and verify ownership
    const guardian = await Guardian.findById(guardianId);
    
    if (!guardian) {
      return res.status(404).json({ message: 'Guardian not found' });
    }
    
    if (guardian.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update guardian
    const updatedGuardian = await Guardian.findByIdAndUpdate(
      guardianId,
      {
        name,
        relationship,
        phone,
        email,
        address
      },
      { new: true }
    );
    
    res.json({
      message: 'Guardian updated successfully',
      guardian: updatedGuardian
    });
  } catch (error) {
    console.error('Update guardian error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a guardian
router.delete('/:guardianId', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const guardianId = req.params.guardianId;
    
    // Find guardian and verify ownership
    const guardian = await Guardian.findById(guardianId);
    
    if (!guardian) {
      return res.status(404).json({ message: 'Guardian not found' });
    }
    
    if (guardian.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Delete guardian
    await Guardian.findByIdAndDelete(guardianId);
    
    // Update user's guardians array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { guardians: guardianId } }
    );
    
    res.json({ message: 'Guardian removed successfully' });
  } catch (error) {
    console.error('Delete guardian error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 