import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Enroll = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState(""); // Placeholder for actual amount
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = () => {
    if (cardNumber.length !== 16) {
      setMessage("Invalid card number. Must be 16 digits.");
      return;
    }

    if (!amount || amount <= 0) {
      setMessage("Invalid amount.");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    setTimeout(() => {
      setIsProcessing(false);
      setMessage("Payment Successful! 🎉 You are enrolled.");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enroll in Course</h2>
        <p className="text-gray-600">Course ID: <span className="font-semibold">{courseId}</span></p>

        {/* Card Number Input */}
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

        {/* Amount Input */}
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

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`mt-6 w-full py-2 rounded-md text-white font-semibold ${
            isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>

        {/* Status Message */}
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
