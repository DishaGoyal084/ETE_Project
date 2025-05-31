const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    questions: [
        {
            text: { type: String, required: true },
            options: [{ type: String, required: true }], 
            correctAnswer: { type: String, required: true } 
        }
    ]
});

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;