import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { AuthContext } from "../context/auth-context";

const stripePromise = loadStripe("pk_test_51R8alAPL07XjEzlquxZHK1vfmMD03dZw4Kty94EKDxTJSOAYWCpMiTuDOlxQC1A7mf31XZylp9WFPkdhu0Y6ZLbe00EclylOmj");

const CheckoutForm = ({ course, userId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        if (error) {
            setMessage("❌ " + error.message);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/student/enroll/${course.courseId}/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Math.round(course.price * 100), 
                    currency: "INR",
                    productName: course.courseName,
                    courseId: course.courseId,
                    paymentMethodId: paymentMethod.id, 
                }),
            });

            const data = await response.json();
            setLoading(false);

            if (data.message.includes("Enrollment successful")) {
                setMessage("✅ Enrollment Successful!");
            } else {
                setMessage("❌ " + data.message);
            }
        } catch (error) {
            setMessage("❌ Error processing payment.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Enter Your Card Details</h2>
            <div className="border border-gray-300 rounded-md p-3 mb-4 bg-gray-50">
                <CardElement className="w-full" />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full py-2 rounded-md text-white font-semibold ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 transition duration-300"}`}
            >
                {loading ? "Processing..." : `Pay ₹${course.price}`}
            </button>
            {message && <p className="mt-3 text-sm text-center font-medium p-2 rounded-md bg-red-100 text-red-600">{message}</p>}
        </form>
    );
};

const Payment = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:8000/courses/${courseId}`);
                if (!response.ok) throw new Error("Failed to fetch course.");
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading Course Details...</div>;

    return (
        <Elements stripe={stripePromise}>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment for {course.courseName}</h2>
                    <p className="text-gray-600">{course.description}</p>
                    <p className="mt-4 text-lg font-semibold">Price: ₹{course.price}</p>
                    <CheckoutForm course={course} userId={userId} />
                </div>
            </div>
        </Elements>
    );
};

export default Payment;
