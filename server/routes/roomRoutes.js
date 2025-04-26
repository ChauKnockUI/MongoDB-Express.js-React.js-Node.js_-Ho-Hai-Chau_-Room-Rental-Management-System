const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms with search capability
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { roomCode: { $regex: search, $options: 'i' } },
          { tenantName: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const rooms = await Room.find(query).populate('paymentType');
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('paymentType');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new room
router.post('/', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { tenantName, phoneNumber, startDate, paymentType, notes } = req.body;
    
    // Create new room
    const room = new Room({
      tenantName,
      phoneNumber,
      startDate,
      paymentType,
      notes
    });
    
    const savedRoom = await room.save();
    const populatedRoom = await Room.findById(savedRoom._id).populate('paymentType');
    
    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: errors.join(', '),
        details: error.errors
      });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Một số dữ liệu không hợp lệ',
        details: error
      });
    } else if (error.code === 11000) {
      // Lỗi duplicate key (thường là roomCode)
      return res.status(400).json({
        message: 'Mã phòng đã tồn tại. Vui lòng thử lại.',
        details: error
      });
    }
    
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete rooms (single or multiple)
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Room IDs are required' });
    }
    
    const result = await Room.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No rooms found with the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} room(s) deleted successfully` });
  } catch (error) {
    console.error('Error deleting rooms:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 