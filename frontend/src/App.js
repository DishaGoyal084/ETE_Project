import { Routes,Route } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ExaminerDashboard from './pages/examiner/Dashboard';
import CreateExam from './pages/examiner/CreateExam';
import NewExamsPage from './pages/examiner/NewExamsPage';
import StudentDashboard from './pages/student/Dashboard';
import TakeTest from "./pages/student/TakeTest";
import WebsiteReview from "./pages/student/WebsiteReview";
import ManageExamsPage from "./pages/examiner/ManageExams";
import AttemptedExams from "./pages/student/AttemptedExams";
import ThankYou from "./pages/student/ThankyouPage"; 
import EditExamPage from "./pages/examiner/EditExamPage";
import ReportPage from "./pages/student/ReportPage";
import Profile from "./pages/student/Profile";
import TeacherReport from "./pages/examiner/TeacherReport";
import AdminAccessKey from './pages/admin/AdminAccessKey';
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path="/examiner/dashboard" element={<ExaminerDashboard />} />
        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/new-exams" element={<NewExamsPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/take-test/:examId" element={<TakeTest />} />
        <Route path="/website-review" element={<WebsiteReview />} />
        <Route path="/manage-exam" element={<ManageExamsPage />} />
        <Route path="/edit-exam/:examId" element={<EditExamPage />} />
        <Route path="/exams" element={<AttemptedExams />} />
        <Route path="/thank-you" element={<ThankYou />} />   
        <Route path="/profile" element={<Profile />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/teacher/report" element={<TeacherReport />} />
        <Route path="/admin/access-key" element={<AdminAccessKey />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/admin/manage-users' element={<ManageUsers />} />
      </Routes>
    </div>
  );
}

export default App;