import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUpload } from '../shared/context/UploadContext';
import ProgressBar from './ProgressBar';

const UploadLession = () => {
    const [lessionFile, setLessionFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [sequenceNumber, setSequenceNumber] = useState('');
    const [resources, setResources] = useState('');
    const [status, setStatus] = useState('active');
    const { courseId } = useParams();
    const { uploading, startUpload, updateProgress, finishUpload } = useUpload();
    const [uploadProgress, setUploadProgress] = useState(0);

    const websocket = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            if (websocket.current) {
                websocket.current.close();
            }
            websocket.current = new WebSocket(`ws://localhost:8000/progress/${courseId}`);

            websocket.current.onopen = () => console.log("✅ WebSocket connected!");
            websocket.current.onmessage = (event) => {
                const message = event.data;
                console.log("message from the sever : ",message);
                if (message.startsWith('PROGRESS:')) {
                    const backendProgress = parseInt(message.split(':')[1]);
                    setUploadProgress(backendProgress);
                    updateProgress(backendProgress);
                }
            };
            websocket.current.onclose = () => console.log("🔌 WebSocket closed");
        };

        if (courseId) connectWebSocket();

        return () => {
            if (websocket.current) {
                websocket.current.close();
                websocket.current = null;
            }
        };
    }, [courseId]);

    const handleFileChange = (e) => {
        setLessionFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!lessionFile) return;

        startUpload();
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('lession', lessionFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('duration', duration);
        formData.append('sequenceNumber', sequenceNumber);
        formData.append('resources', resources);
        formData.append('status', status);

        try {
            const response = await fetch(`http://localhost:8000/lessions/${courseId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                finishUpload(true); // Indicate success
                setTitle('');
                setDescription('');
                setDuration('');
                setSequenceNumber('');
                setResources('');
                setLessionFile(null);
                fileInputRef.current.value = ''; // Reset file input
                setUploadProgress(0);
            } else {
                finishUpload(false);
            }
        } catch (error) {
            console.error('Upload error:', error);
            finishUpload(false);
        }
    };

    useEffect(() => {
        updateProgress(uploadProgress);
    }, [uploadProgress, updateProgress]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-gray-700">Upload Lesson</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (mins)" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="number" value={sequenceNumber} onChange={(e) => setSequenceNumber(e.target.value)} placeholder="Sequence Number" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" value={resources} onChange={(e) => setResources(e.target.value)} placeholder="Resources" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} required className="w-full p-3 border rounded-lg bg-gray-100 file:bg-blue-500 file:text-white file:px-3 file:py-2 file:rounded-md" />

                    <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
            <ProgressBar />
        </div>
    );
};

export default UploadLession;
