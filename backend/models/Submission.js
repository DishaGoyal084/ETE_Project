const mongoose = require('mongoose');
const User=require('./User');
const Exam=require('./Exam');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  answers: [String], 
  score: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema); 
