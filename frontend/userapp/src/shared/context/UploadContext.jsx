// frontend/src/shared/context/UploadContext.js
import { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [showProgress, setShowProgress] = useState(true);

    const startUpload = () => {
        setUploading(true);
        setUploadProgress(0);
        setShowProgress(true);
        setUploadSuccess(false);
    };

    const updateProgress = (progress) => {
        setUploadProgress(progress);
    };

    const finishUpload = (success = true) => {
        setUploading(false);
        setUploadSuccess(success);
        setTimeout(() => {
            setShowProgress(false);
            setUploadSuccess(false);
        }, 3000);
    };

    return (
        <UploadContext.Provider value={{ uploading, uploadProgress, uploadSuccess, showProgress, startUpload, updateProgress, finishUpload, setShowProgress }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => useContext(UploadContext);