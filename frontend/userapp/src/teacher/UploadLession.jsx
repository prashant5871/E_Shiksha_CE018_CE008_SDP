import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUpload } from '../shared/context/UploadContext';
import ProgressBar from './ProgressBar';

const UploadLession = () => {
  const [lessionFile, setLessionFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

      websocket.current.onopen = () => console.log('✅ WebSocket connected!');
      websocket.current.onmessage = (event) => {
        const message = event.data;
        console.log('message from the sever : ', message);
        if (message.startsWith('PROGRESS:')) {
          const backendProgress = parseInt(message.split(':')[1]);
          setUploadProgress(backendProgress);
          updateProgress(backendProgress);
        }
      };
      websocket.current.onclose = () => console.log('🔌 WebSocket closed');
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
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setLessionFile(selectedFile);
    } else {
      alert('Please select a video file.');
      e.target.value = ''; // Clear the invalid file selection
    }
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
    formData.append('sequenceNumber', sequenceNumber);
    formData.append('resources', resources);
    formData.append('status', status);

    try {
      const response = await fetch(`http://localhost:8000/lessions/${courseId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        finishUpload(true);
        setTitle('');
        setDescription('');
        setSequenceNumber('');
        setResources('');
        setLessionFile(null);
        fileInputRef.current.value = '';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col justify-center items-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Upload Lesson
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          ></textarea>
          <input
            type="number"
            value={sequenceNumber}
            onChange={(e) => setSequenceNumber(e.target.value)}
            placeholder="Sequence Number"
            required
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <input
            type="text"
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            placeholder="Resources"
            required
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            required
            accept="video/*"
            className="w-full p-4 border rounded-xl bg-gray-100 file:bg-blue-600 file:text-white file:px-6 file:py-3 file:rounded-xl file:border-0 file:font-semibold hover:file:bg-blue-700"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
      <ProgressBar />
    </div>
  );
};

export default UploadLession;