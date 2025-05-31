const express = require('express');
const router = express.Router();
const {ensureAuthenticated,ensureExaminer} = require('../middleware/auth'); 
const Exam = require("../models/Exam");
const Submission=require("../models/Submission");
const User=require("../models/User");


router.post('/protected-route', ensureAuthenticated, (req, res) => {
    res.json({ message: "You have access!", user: req.user });
});


router.post("/exams",  async (req, res) => {
    try {
        const { title, description, date, duration, questions } = req.body;

        if (!title || !date) {
            return res.status(400).json({ error: "Title and Date are required" });
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text) {
                return res.status(400).json({ error: `Question ${i + 1} is missing text` });
            }

            if (!q.options || q.options.length < 2) {
                return res.status(400).json({ error: `Question ${i + 1} must have at least two options` });
            }
            if (!q.correctAnswer) {
                return res.status(400).json({ error: `Question ${i + 1} must have a correct answer` });
            }
        }

        const newExam = new Exam({ title, description, date, duration, questions });
        const savedExam = await newExam.save();

        res.status(201).json(savedExam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  
router.get("/exams", async (req, res) => {
    try {
        console.log("Fetching exams..."); 
        const exams = await Exam.find().select("title description date examiner");
        console.log("Exams fetched:", exams); 
        res.json(exams);
    } catch (error) {
        console.error("Error fetching exams:", error);
        res.status(500).json({ message: "Error fetching exams", error });
    }
});


router.get('/exams/:examId', async (req, res) => {
    const { examId } = req.params;
    try {
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json(exam);
    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete("/exams/:examId", async (req, res) => {
    try {
        const { examId } = req.params;
        const deletedExam = await Exam.findByIdAndDelete(examId);
        if (!deletedExam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/exams/:examId", async (req, res) => {
    try {
        const { examId } = req.params; 
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.json(exam);
    } catch (error) {
        console.error("Error fetching exam by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.put('/exams/:examId', async (req, res) => {
    const { examId } = req.params;  
    const updatedExamData = req.body;  
    try {
        const updatedExam = await Exam.findByIdAndUpdate(examId, updatedExamData, {
            new: true,  
            runValidators: true  
        });
        if (!updatedExam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json(updatedExam);
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).json({ message: 'Failed to update exam', error: error.message });
    }
});

router.get('/submissions', async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('student')  
            .populate('test')     
            .then(submissions => {
                return submissions.filter(submission =>submission.test && submission.test.type === 'subjective');
            });
        if (submissions.length === 0) {
            return res.status(404).json({ message: 'No subjective exam submissions available' });
        }        
        res.status(200).json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
});

router.get("/teacher/reports", async (req, res) => {
    try {
      const reports = await Submission.find()
        .populate("student", "name email")
        .populate("test", "title")
        .sort({ submittedAt: -1 });  
      const formattedReports = reports.map(sub => ({
        studentName: sub.student.name,
        studentEmail: sub.student.email,
        testName: sub.test.title,
        score: sub.score,
        submittedAt: sub.submittedAt
      }));  
      res.json(formattedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      res.status(500).json({ message: "Server error while fetching reports" });
    }
  });
  

module.exports = router; 
