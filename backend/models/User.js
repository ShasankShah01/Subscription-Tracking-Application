const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  country: {
    type: String,
    default: 'India',
  },
  preferredCurrency: {
    type: String,
    default: 'INR',
  },
  role: {
    type: String,
    enum: ['User', 'System Analyst', 'Admin'],
    default: 'User',
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  passwordResetRequested: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
