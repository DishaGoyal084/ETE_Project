const express = require("express");
const { ensureStudent } = require("../middleware/auth");
const Exam = require("../models/Exam"); 
const Submission = require('../models/Submission');
const User= require("../models/User");
const routes = express.Router();
const mongoose=require('mongoose');

routes.get("/exams", ensureStudent, async (req, res) => {
    console.log(req.params);
    try {
        const exams = await Exam.find(); 
        if (exams.length === 0) {
            return res.status(404).json({ message: "No exams found" });
        }
        res.status(200).json(exams);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

routes.get('/exams/:examId',  async (req, res) => {
    console.log("Request Params:", req.params);  

    const examId = req.params.examId;
    console.log('Received examId:', examId);
    
    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
    }

    try {
        const exam = await Exam.findById(examId);

        if (!exam) {
            console.log('Exam not found');
            return res.status(404).json({ message: "Exam not found" });
        }

        res.status(200).json(exam);
    } catch (err) {
        console.error('Error fetching exam:', err);
        res.status(500).json({ message: "Error fetching exam", error: err.message });
    }
});

routes.post('/exams/:examId/submit', ensureStudent, async (req, res) => {
    const { examId } = req.params;
    const rawAnswers = req.body.answers;
    console.log("Received answers:", req.body.answers);

    try {
        let answersArray = [];

        if (Array.isArray(rawAnswers)) {
            answersArray = rawAnswers;
        } else if (typeof rawAnswers === 'object' && rawAnswers !== null) {
            answersArray = Object.values(rawAnswers);
        } else {
            return res.status(400).json({ message: "Invalid answers format. Must be array or object." });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        let score = 0;
        exam.questions.forEach((question, index) => {
            const correct = question.correctAnswer;
            const userAnswer = answersArray[index];
            if (userAnswer === correct) {
                score++;
            }
        });

        const submission = new Submission({
            student: req.user._id,
            test: examId,
            answers: answersArray,
            score,
            submittedAt: new Date(),
        });

        await submission.save();

        res.status(200).json({
            message: "Test submitted successfully",
            score,
            total: exam.questions.length
        });
    } catch (err) {
        console.error("Error during test submission:", err);
        res.status(500).json({ message: "Failed to submit the test", error: err.message });
    }
});

routes.get('/submissions',ensureStudent, async (req, res) => {
    if (!req.user || !mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(401).json({ message: "User not authenticated or invalid ID" });
    }
    
    try {
        const submissions = await Submission.find({ student: req.user._id })
            .populate('student', 'name') 
            .populate('test', 'title duration questions'); 

        const reports = submissions.map(sub => {
            const timeTakenMinutes = sub.answers?.length * 1; 
            return {
                studentName: sub.student?.name || 'N/A',
                examTitle: sub.test?.title || 'Unknown',
                submittedAt: sub.submittedAt,
                timeTaken: timeTakenMinutes,
                score: sub.score,
                total: sub.test?.questions?.length || 0        
            };
        });

        res.status(200).json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch report" });
    }
});

routes.get('/attemptedExams', ensureStudent, async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user._id })
            .populate('test', 'title description') 
            .populate('student', 'name');

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ message: 'No exams attempted.' });
        }

        const attemptedExams = submissions.map(sub => ({
            examTitle: sub.test.title,
            examDescription: sub.test.description,
            score: sub.score,
            totalQuestions: sub.test.questions?.length,
            submittedAt: sub.submittedAt,
        }));

        res.status(200).json(attemptedExams);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch attempted exams.' });
    }
});

routes.get('/profile', ensureStudent, async (req, res) => {
    try {
        const student = await User.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(student);
        console.log(req.user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

routes.put('/profile', ensureStudent, async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, enrollmentNo, department, year } = req.body;

        const updatedStudent = await User.findByIdAndUpdate(
            userId,
            { name, email, enrollmentNo, department, year },
            { new: true } 
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(updatedStudent);
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "An error occurred while updating profile." });
    }
});

module.exports = routes;
