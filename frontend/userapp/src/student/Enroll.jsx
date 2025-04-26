import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51R8alAPL07XjEzlquxZHK1vfmMD03dZw4Kty94EKDxTJSOAYWCpMiTuDOlxQC1A7mf31XZylp9WFPkdhu0Y6ZLbe00EclylOmj");

const Enroll = () => {
    const { courseId } = useParams();
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:8000/courses/${courseId}`);
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                setMessage("Failed to fetch course details.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleEnrollment = async () => {
        if (!course) return;

        if (course.price === 0) {
            // Direct enrollment
            try {
                const response = await fetch(`http://localhost:8000/student/enroll-free/${courseId}/${userId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage("✅ Successfully Enrolled!");
                    setTimeout(() => navigate("/dashboard"), 2000);
                } else {
                    setMessage(`❌ Enrollment failed: ${data.message}`);
                }
            } catch (error) {
                setMessage("❌ Enrollment failed. Try again later.");
            }
        } else {
            navigate(`/payment/${courseId}`);
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.courseName}</h2>
                <p className="text-gray-600">{course.description}</p>
                <p className="mt-4 font-semibold">Price: {course.price === 0 ? "Free" : `₹${course.price}`}</p>
                <button
                    onClick={handleEnrollment}
                    className="mt-6 w-full py-2 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 transition duration-300"
                >
                    {course.price === 0 ? "Enroll for Free" : "Proceed to Payment"}
                </button>
                {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
            </div>
        </div>
    );
};

export default Enroll;
