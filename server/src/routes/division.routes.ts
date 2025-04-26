import express from 'express';
import Division from '../models/division.model';
import User from '../models/user.model';
import { authenticate, authorize } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get all divisions
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const divisions = await Division.find({})
      .populate('policeOfficers', 'name email phone')
      .sort({ name: 1 });
    
    res.json({ divisions });
  } catch (error) {
    console.error('Get divisions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get division by ID
router.get('/:divisionId', authenticate, async (req: AuthRequest, res) => {
  try {
    const divisionId = req.params.divisionId;
    
    const division = await Division.findById(divisionId)
      .populate('policeOfficers', 'name email phone');
    
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }
    
    res.json({ division });
  } catch (error) {
    console.error('Get division error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new division (admin only)
router.post('/', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const { name, area, city, state } = req.body;
    
    // Validate required fields
    if (!name || !area || !city || !state) {
      return res.status(400).json({ message: 'Name, area, city, and state are required' });
    }
    
    // Check if division with same name exists
    const existingDivision = await Division.findOne({ name });
    if (existingDivision) {
      return res.status(400).json({ message: 'Division with this name already exists' });
    }
    
    // Create new division
    const division = new Division({
      name,
      area,
      city,
      state,
      policeOfficers: []
    });
    
    await division.save();
    
    res.status(201).json({
      message: 'Division created successfully',
      division
    });
  } catch (error) {
    console.error('Create division error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update division (admin only)
router.put('/:divisionId', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const divisionId = req.params.divisionId;
    const { name, area, city, state } = req.body;
    
    // Check if division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }
    
    // If changing name, check if the new name already exists
    if (name && name !== division.name) {
      const existingDivision = await Division.findOne({ name });
      if (existingDivision) {
        return res.status(400).json({ message: 'Division with this name already exists' });
      }
    }
    
    // Update division
    const updatedDivision = await Division.findByIdAndUpdate(
      divisionId,
      {
        name: name || division.name,
        area: area || division.area,
        city: city || division.city,
        state: state || division.state
      },
      { new: true }
    );
    
    res.json({
      message: 'Division updated successfully',
      division: updatedDivision
    });
  } catch (error) {
    console.error('Update division error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete division (admin only)
router.delete('/:divisionId', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const divisionId = req.params.divisionId;
    
    // Check if division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }
    
    // Check if division has police officers
    if (division.policeOfficers.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete division with assigned police officers. Reassign officers first.' 
      });
    }
    
    // Delete division
    await Division.findByIdAndDelete(divisionId);
    
    res.json({ message: 'Division deleted successfully' });
  } catch (error) {
    console.error('Delete division error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add police officer to division (admin only)
router.post('/:divisionId/officers', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const divisionId = req.params.divisionId;
    const { policeOfficerId } = req.body;
    
    // Validate required fields
    if (!policeOfficerId) {
      return res.status(400).json({ message: 'Police officer ID is required' });
    }
    
    // Check if division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }
    
    // Check if police officer exists and has the correct role
    const policeOfficer = await User.findById(policeOfficerId);
    if (!policeOfficer || policeOfficer.role !== 'police') {
      return res.status(400).json({ message: 'Invalid police officer ID' });
    }
    
    // Check if police officer is already in a division
    if (policeOfficer.division) {
      // Remove from old division if different
      if (policeOfficer.division.toString() !== divisionId) {
        await Division.findByIdAndUpdate(
          policeOfficer.division,
          { $pull: { policeOfficers: policeOfficerId } }
        );
      } else {
        return res.status(400).json({ message: 'Police officer is already in this division' });
      }
    }
    
    // Add to division
    const updatedDivision = await Division.findByIdAndUpdate(
      divisionId,
      { $addToSet: { policeOfficers: policeOfficerId } },
      { new: true }
    );
    
    // Update police officer's division
    await User.findByIdAndUpdate(
      policeOfficerId,
      { division: divisionId }
    );
    
    res.json({
      message: 'Police officer added to division successfully',
      division: updatedDivision
    });
  } catch (error) {
    console.error('Add police to division error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove police officer from division (admin only)
router.delete('/:divisionId/officers/:officerId', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const { divisionId, officerId } = req.params;
    
    // Check if division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }
    
    // Check if police officer exists
    const policeOfficer = await User.findById(officerId);
    if (!policeOfficer || policeOfficer.role !== 'police') {
      return res.status(400).json({ message: 'Invalid police officer ID' });
    }
    
    // Check if police officer is in this division
    if (!policeOfficer.division || policeOfficer.division.toString() !== divisionId) {
      return res.status(400).json({ message: 'Police officer is not in this division' });
    }
    
    // Remove from division
    const updatedDivision = await Division.findByIdAndUpdate(
      divisionId,
      { $pull: { policeOfficers: officerId } },
      { new: true }
    );
    
    // Update police officer's division
    await User.findByIdAndUpdate(
      officerId,
      { $unset: { division: 1 } }
    );
    
    res.json({
      message: 'Police officer removed from division successfully',
      division: updatedDivision
    });
  } catch (error) {
    console.error('Remove police from division error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 