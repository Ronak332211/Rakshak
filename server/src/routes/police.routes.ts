import express from 'express';
import Complaint from '../models/complaint.model';
import User from '../models/user.model';
import { authenticate, authorize } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';
import { sendStatusUpdateEmail } from '../services/email.service';

const router = express.Router();

// Police routes are protected using the authorize middleware
const policeOnly = authorize(['police', 'admin']);

// Get dashboard stats for police
router.get('/dashboard', authenticate, policeOnly, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Get user to check division
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // For assigned complaints
    const assignedComplaints = await Complaint.countDocuments({ assignedTo: req.user.id });
    const assignedPending = await Complaint.countDocuments({ 
      assignedTo: req.user.id,
      status: 'pending'
    });
    const assignedInProgress = await Complaint.countDocuments({ 
      assignedTo: req.user.id,
      status: 'in-progress'
    });
    const assignedResolved = await Complaint.countDocuments({ 
      assignedTo: req.user.id,
      status: 'resolved'
    });
    
    // For division complaints
    let divisionFilter = {};
    if (user.division) {
      divisionFilter = { division: user.division };
    }
    
    const divisionComplaints = await Complaint.countDocuments(divisionFilter);
    const divisionPending = await Complaint.countDocuments({ 
      ...divisionFilter,
      status: 'pending'
    });
    const divisionInProgress = await Complaint.countDocuments({ 
      ...divisionFilter,
      status: 'in-progress'
    });
    const divisionResolved = await Complaint.countDocuments({ 
      ...divisionFilter,
      status: 'resolved'
    });
    
    // Get recent complaints
    const recentComplaints = await Complaint.find({
      $or: [
        { assignedTo: req.user.id },
        divisionFilter
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('division', 'name');
    
    res.json({
      assigned: {
        total: assignedComplaints,
        pending: assignedPending,
        inProgress: assignedInProgress,
        resolved: assignedResolved
      },
      division: {
        total: divisionComplaints,
        pending: divisionPending,
        inProgress: divisionInProgress,
        resolved: divisionResolved
      },
      recentComplaints
    });
  } catch (error) {
    console.error('Police dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get complaints assigned to police officer
router.get('/complaints', authenticate, policeOnly, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Get user to check division
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let filter: any = {
      $or: [
        { assignedTo: req.user.id }
      ]
    };
    
    // Add division filter if exists
    if (user.division) {
      filter.$or.push({ division: user.division });
    }
    
    // Apply status filter if provided
    const { status } = req.query;
    if (status && ['pending', 'in-progress', 'resolved', 'dismissed'].includes(status as string)) {
      filter.status = status;
    }
    
    const complaints = await Complaint.find(filter)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('division', 'name area')
      .sort({ updatedAt: -1 });
    
    res.json({ complaints });
  } catch (error) {
    console.error('Get police complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status
router.put('/complaints/:complaintId/status', authenticate, policeOnly, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const complaintId = req.params.complaintId;
    const { status, message } = req.body;
    
    // Validate required fields
    if (!status || !message) {
      return res.status(400).json({ message: 'Status and message are required' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Get user to check division
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find complaint
    const complaint = await Complaint.findById(complaintId).populate('user');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if police officer is assigned or in same division
    const isAssigned = complaint.assignedTo?.toString() === req.user.id;
    const isInSameDivision = user.division && complaint.division?.toString() === user.division.toString();
    
    if (!isAssigned && !isInSameDivision) {
      return res.status(403).json({ message: 'Unauthorized. You are not assigned to this complaint.' });
    }
    
    // Update complaint status
    complaint.status = status;
    complaint.statusUpdates.push({
      status,
      message,
      updatedBy: req.user.id,
      timestamp: new Date()
    });
    
    await complaint.save();
    
    // Send email notification to the complaint owner
    if (complaint.user) {
      await sendStatusUpdateEmail(
        complaint.user as any,
        complaint.title,
        status,
        message
      );
    }
    
    res.json({
      message: 'Complaint status updated successfully',
      status,
      statusUpdates: complaint.statusUpdates
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 