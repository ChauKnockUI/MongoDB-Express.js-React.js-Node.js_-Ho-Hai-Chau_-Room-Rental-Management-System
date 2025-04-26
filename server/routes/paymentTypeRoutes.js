const express = require('express');
const router = express.Router();
const PaymentType = require('../models/PaymentType');

// Get all payment types
router.get('/', async (req, res) => {
  try {
    const paymentTypes = await PaymentType.find();
    console.log('Payment types fetched:', paymentTypes);
    res.json(paymentTypes);
  } catch (error) {
    console.error('Error fetching payment types:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Initialize payment types if they don't exist
router.post('/init', async (req, res) => {
  try {
    const count = await PaymentType.countDocuments();
    
    if (count === 0) {
      // Create default payment types
      const paymentTypes = [
        { name: 'Theo tháng' },
        { name: 'Theo quý' },
        { name: 'Theo năm' }
      ];
      
      const result = await PaymentType.insertMany(paymentTypes);
      console.log('Payment types initialized:', result);
      return res.status(201).json({ message: 'Payment types initialized successfully', data: result });
    }
    
    const existingTypes = await PaymentType.find();
    return res.status(200).json({ message: 'Payment types already initialized', data: existingTypes });
  } catch (error) {
    console.error('Error initializing payment types:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// For debugging - get payment type by id
router.get('/:id', async (req, res) => {
  try {
    const paymentType = await PaymentType.findById(req.params.id);
    if (!paymentType) {
      return res.status(404).json({ message: 'Payment type not found' });
    }
    res.json(paymentType);
  } catch (error) {
    console.error('Error fetching payment type:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 