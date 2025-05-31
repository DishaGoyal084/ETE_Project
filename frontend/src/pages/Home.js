import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

function Home() {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ExamPro</h1>
          <p>Your one-stop solution for online exams and certifications. Take exams, earn certificates, and showcase your skills to the world!</p>
          <div className="buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Signup</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose ExamPro?</h2>
        <div className="feature-grid">
          <div className="feature-box">
            <h3>Online Exams</h3>
            <p>Take exams anytime, anywhere. Our platform supports a wide range of question types and provides instant results.</p>
          </div>
          <div className="feature-box">
            <h3>Certificates</h3>
            <p>Earn certificates upon successful completion of exams. Download and share your achievements with employers.</p>
          </div>
          <div className="feature-box">
            <h3>User-Friendly</h3>
            <p>Our intuitive interface ensures a seamless experience for both students and administrators.</p>
          </div>
        </div>
      </section>

      
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Sign Up</h3>
            <p>Create an account to get started. It's quick and easy!</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Take Exams</h3>
            <p>Choose from a variety of exams and start testing your knowledge.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Get Certified</h3>
            <p>Receive your certificate instantly upon passing the exam.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-box">
            <p>"ExamPro made it so easy to take exams and get certified. Highly recommended!"</p>
            <span>- John Doe</span>
          </div>
          <div className="testimonial-box">
            <p>"The certificates I earned helped me land my dream job. Thank you, ExamPro!"</p>
            <span>- Jane Smith</span>
          </div>
          <div className="testimonial-box">
            <p>"A user-friendly platform with excellent support. Great experience overall!"</p>
            <span>- Alex Johnson</span>
          </div>
        </div>
      </section>

      
      <footer className="footer">
        <p>&copy; 2023 ExamPro. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;