const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      unique: true
    },
    tenantName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    phoneNumber: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    paymentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentType',
      required: true
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

// Auto-generate room code on save (PT-001, PT-002, etc.)
RoomSchema.pre('save', async function(next) {
  try {
    if (!this.isNew) {
      return next();
    }
    
    // Tìm mã phòng lớn nhất hiện có
    const Room = mongoose.model('Room');
    let maxRoomCode = await Room.findOne({}, { roomCode: 1 })
      .sort({ roomCode: -1 });
    
    let newCount = 1;
    
    if (maxRoomCode && maxRoomCode.roomCode) {
      // Trích xuất số từ mã phòng, ví dụ: "PT-003" -> 3
      const currentCountStr = maxRoomCode.roomCode.split('-')[1];
      if (currentCountStr) {
        const currentCount = parseInt(currentCountStr, 10);
        if (!isNaN(currentCount)) {
          newCount = currentCount + 1;
        }
      }
    }
    
    // Tạo mã phòng mới với số tiếp theo
    this.roomCode = `PT-${String(newCount).padStart(3, '0')}`;
    
    // Kiểm tra xem mã phòng đã tồn tại chưa
    const existingRoom = await Room.findOne({ roomCode: this.roomCode });
    if (existingRoom) {
      // Nếu đã tồn tại, tăng số lên 1 và thử lại
      const countFromCode = parseInt(this.roomCode.split('-')[1], 10);
      this.roomCode = `PT-${String(countFromCode + 1).padStart(3, '0')}`;
      
      // Kiểm tra lại lần nữa để đảm bảo
      const checkAgain = await Room.findOne({ roomCode: this.roomCode });
      if (checkAgain) {
        // Nếu vẫn trùng, dùng timestamp để đảm bảo duy nhất
        this.roomCode = `PT-${String(Date.now() % 1000).padStart(3, '0')}`;
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Room', RoomSchema); 