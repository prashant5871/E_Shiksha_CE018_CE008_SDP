import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";


const Enroll = () => {
  const { courseId } = useParams();
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const { userId } = useContext(AuthContext); // Get userId from AuthContext
  // const {token} = useContext(AuthContext);
  

  console.log("user id : ",userId);

  const handlePayment = async () => {
    if (cardNumber.length !== 16) {
      setMessage("Invalid card number. Must be 16 digits.");
      return;
    }

    if (!amount || amount <= 0) {
      setMessage("Invalid amount.");
      return;
    }

    if (!userId) {
      setMessage("User not logged in.");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      console.log("USer id : " , userId);
      console.log("token is : ",localStorage.getItem("authToken"));
      const response = await fetch(`http://localhost:8000/student/enroll/${courseId}/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Berear ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          debitCardNumber: cardNumber,
          amount: amount,
        }),
      });

      if (response.ok) {
        setMessage("Payment Successful! 🎉 You are enrolled.");
      } else {
        const errorData = await response.json();
        setMessage(`Payment failed: ${errorData.message || "Unknown error"}`);
        console.log(errorData);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed: An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enroll in Course</h2>

        <div className="mt-4">
          <label className="block text-gray-700 font-medium">Debit Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
            maxLength="16"
            placeholder="1234 5678 9012 3456"
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-medium">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`mt-6 w-full py-2 rounded-md text-white font-semibold ${
            isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>

        {message && (
          <p className={`mt-4 text-sm font-medium ${message.includes("Successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Enroll;