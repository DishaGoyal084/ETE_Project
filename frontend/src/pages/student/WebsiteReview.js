import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '../../styles/Student.css'

const WebsiteReview = () => {
    const [review, setReview] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmitReview = async () => {
       navigate("/thank-you");  
    };

    

    return (
        <div className="website-review">
            <h1>Website Review</h1>
            <textarea 
                placeholder="Write your feedback here..." 
                value={review} 
                onChange={(e) => setReview(e.target.value)} 
            />
            <button onClick={handleSubmitReview}>Submit Review</button>
        </div>
    );

};

export default WebsiteReview;
