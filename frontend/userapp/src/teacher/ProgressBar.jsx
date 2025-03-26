import { useUpload } from "../shared/context/UploadContext";
import React from "react";

const ProgressBar = () => {
    const { uploadProgress, uploading, uploadSuccess, showProgress, setShowProgress } = useUpload();

    if (!showProgress) return null;

    const getProgressColor = () => {
        if (uploadProgress < 30) return "bg-red-500";
        if (uploadProgress < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="fixed bottom-5 right-5 bg-white shadow-xl rounded-lg p-4 w-80 flex flex-col items-center animate-fade-in">
            {/* Progress Bar Container */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                    className={`h-4 rounded-full ${getProgressColor()}`}
                    style={{
                        width: `${uploadProgress}%`,
                        transition: "width 0.3s ease"
                    }}
                ></div>
            </div>
            
            {/* Upload Text */}
            <p className="text-sm mt-3 font-medium text-gray-600">
                {uploading
                    ? `Uploading... ${uploadProgress}%`
                    : uploadSuccess
                    ? "🎉 Upload Successful!"
                    : "⚠️ Upload Failed!"}
            </p>
            
            {/* Close Button */}
            <button
                onClick={() => setShowProgress(false)}
                className="mt-3 text-sm text-red-600 border-2 border-red-600 rounded-lg px-3 py-1 hover:bg-red-600 hover:text-white transition-all"
            >
                Hide
            </button>
        </div>
    );
};

export default ProgressBar;
