import express from 'express';
import User from '../models/user.model';
import Division from '../models/division.model';
import Complaint from '../models/complaint.model';
import { authenticate, authorize } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Admin routes are protected using the authorize middleware
const adminOnly = authorize(['admin']);

// Get all users
router.get('/users', authenticate, adminOnly, async (req: AuthRequest, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate('division', 'name area')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:userId', authenticate, adminOnly, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('division', 'name area');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create police officer account
router.post('/police', authenticate, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { name, email, password, phone, divisionId } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, password, and phone are required' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new police officer
    const policeOfficer = new User({
      name,
      email,
      password, // Will be hashed in the pre-save hook
      phone,
      role: 'police',
      division: divisionId
    });
    
    await policeOfficer.save();
    
    // Add police officer to division if provided
    if (divisionId) {
      await Division.findByIdAndUpdate(
        divisionId,
        { $push: { policeOfficers: policeOfficer._id } }
      );
    }
    
    res.status(201).json({
      message: 'Police officer account created successfully',
      user: {
        id: policeOfficer._id,
        name: policeOfficer.name,
        email: policeOfficer.email,
        role: policeOfficer.role,
        division: policeOfficer.division
      }
    });
  } catch (error) {
    console.error('Create police officer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (change role, division, etc.)
router.put('/users/:userId', authenticate, adminOnly, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, phone, role, divisionId, active } = req.body;
    
    // Get current user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If changing role to police, ensure they have a division
    if (role === 'police' && !divisionId && !user.division) {
      return res.status(400).json({ message: 'Police officers must be assigned to a division' });
    }
    
    // If changing division, update old and new divisions
    if (divisionId && user.division && divisionId !== user.division.toString()) {
      // Remove from old division
      await Division.findByIdAndUpdate(
        user.division,
        { $pull: { policeOfficers: userId } }
      );
      
      // Add to new division
      await Division.findByIdAndUpdate(
        divisionId,
        { $push: { policeOfficers: userId } }
      );
    } else if (divisionId && !user.division) {
      // Add to division if not already in one
      await Division.findByIdAndUpdate(
        divisionId,
        { $push: { policeOfficers: userId } }
      );
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        role,
        division: divisionId,
        active: active !== undefined ? active : user.active
      },
      { new: true }
    ).select('-password');
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:userId', authenticate, adminOnly, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId;
    
    // Prevent deleting the admin account
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.email === 'ronaknerhara1122@gmail.com') {
      return res.status(403).json({ message: 'Cannot delete the main admin account' });
    }
    
    // If user is a police officer, remove from division
    if (user.role === 'police' && user.division) {
      await Division.findByIdAndUpdate(
        user.division,
        { $pull: { policeOfficers: userId } }
      );
    }
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticate, adminOnly, async (req: AuthRequest, res) => {
  try {
    // Get complaint stats
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in-progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const dismissedComplaints = await Complaint.countDocuments({ status: 'dismissed' });
    
    // Get user stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPolice = await User.countDocuments({ role: 'police' });
    const totalDivisions = await Division.countDocuments();
    
    // Get recent complaints
    const recentComplaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('division', 'name')
      .populate('assignedTo', 'name');
    
    res.json({
      stats: {
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          dismissed: dismissedComplaints
        },
        users: {
          total: totalUsers,
          police: totalPolice,
          divisions: totalDivisions
        }
      },
      recentComplaints
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 