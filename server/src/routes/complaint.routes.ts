import express from 'express';
import Complaint from '../models/complaint.model';
import User from '../models/user.model';
import Division from '../models/division.model';
import { authenticate, authorize } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';
import { sendStatusUpdateEmail } from '../services/email.service';

const router = express.Router();

// Get all complaints (filtered by user role)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    let complaints;
    let filter: any = {};
    
    // Get user to check role
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter complaints based on user role
    if (user.role === 'user') {
      // Regular users can only see their own complaints
      filter.user = req.user.id;
    } else if (user.role === 'police') {
      // Police can see either assigned to them or in their division
      filter = {
        $or: [
          { assignedTo: req.user.id },
          { division: user.division }
        ]
      };
    }
    // Admin can see all complaints (no filter)
    
    complaints = await Complaint.find(filter)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('division', 'name area')
      .sort({ createdAt: -1 });
    
    res.json({ complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific complaint
router.get('/:complaintId', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const complaintId = req.params.complaintId;
    
    const complaint = await Complaint.findById(complaintId)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('division', 'name area')
      .populate({
        path: 'statusUpdates.updatedBy',
        select: 'name role'
      });
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user is authorized to view this complaint
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'user' && complaint.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (user.role === 'police' && 
        complaint.assignedTo?._id.toString() !== req.user.id && 
        complaint.division?._id.toString() !== user.division?.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json({ complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// File a new complaint
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { title, description, location, attachments } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    // Get user to add current location if provided
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find appropriate division based on location (simplified version)
    // In a real app, this would use geospatial queries
    let division = null;
    if (location && location.latitude && location.longitude) {
      // For demo, just get the first division
      division = await Division.findOne({});
    }
    
    // Create new complaint
    const complaint = new Complaint({
      title,
      description,
      user: req.user.id,
      status: 'pending',
      division: division ? division._id : undefined,
      location: location || user.currentLocation,
      attachments,
      statusUpdates: [{
        status: 'pending',
        message: 'Complaint filed',
        updatedBy: req.user.id,
        timestamp: new Date()
      }]
    });
    
    await complaint.save();
    
    res.status(201).json({
      message: 'Complaint filed successfully',
      complaint
    });
  } catch (error) {
    console.error('File complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status (police or admin only)
router.put('/:complaintId/status', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user is police or admin
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'police' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Only police or admin can update status.' });
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
    
    // Find complaint
    const complaint = await Complaint.findById(complaintId).populate('user');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if police officer is assigned or in same division
    if (user.role === 'police') {
      const isAssigned = complaint.assignedTo?.toString() === req.user.id;
      const isInSameDivision = complaint.division?.toString() === user.division?.toString();
      
      if (!isAssigned && !isInSameDivision) {
        return res.status(403).json({ message: 'Unauthorized. You are not assigned to this complaint.' });
      }
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

// Assign complaint to police officer (admin only)
router.put('/:complaintId/assign', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const complaintId = req.params.complaintId;
    const { policeOfficerId, divisionId } = req.body;
    
    // Validate required fields
    if (!policeOfficerId) {
      return res.status(400).json({ message: 'Police officer ID is required' });
    }
    
    // Validate police officer
    const policeOfficer = await User.findById(policeOfficerId);
    if (!policeOfficer || policeOfficer.role !== 'police') {
      return res.status(400).json({ message: 'Invalid police officer ID' });
    }
    
    // Update complaint
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        assignedTo: policeOfficerId,
        division: divisionId || policeOfficer.division,
        status: 'in-progress',
        $push: {
          statusUpdates: {
            status: 'in-progress',
            message: `Assigned to police officer ${policeOfficer.name}`,
            updatedBy: req.user.id,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).populate('user').populate('assignedTo', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Send email notification to the complaint owner
    if (complaint.user) {
      await sendStatusUpdateEmail(
        complaint.user as any,
        complaint.title,
        'in-progress',
        `Your complaint has been assigned to officer ${policeOfficer.name}`
      );
    }
    
    res.json({
      message: 'Complaint assigned successfully',
      complaint
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 