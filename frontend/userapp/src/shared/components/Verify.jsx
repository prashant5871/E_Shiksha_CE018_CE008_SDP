import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from './Logo';
import Loading from './Loading';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const verificationCode = searchParams.get('code');

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/auth/varify/${verificationCode}`, {
        method: 'POST',
      });

      if (!response.ok) {
        // const errorData = await response.json();
        throw new Error('Verification failed.');
      }

      toast.success('Verification successful!', { autoClose: 2000, hideProgressBar: true });
      navigate('/'); // Redirect to home or login page after successful verification
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo h={"20"} w={"20"} color={"#000000"} />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Verify Your Account</h2>
        <p className="text-gray-600 text-center mb-6">Click the button below to verify your account.</p>
        <div className="flex justify-center">
          <button
            onClick={handleVerify}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;