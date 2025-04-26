const mongoose = require('mongoose');

const PaymentTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['Theo tháng', 'Theo quý', 'Theo năm']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentType', PaymentTypeSchema); 