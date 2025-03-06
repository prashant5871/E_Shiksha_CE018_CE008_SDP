import React, { useState } from 'react';

const UploadLession = () => {
    const [lessionFile, setLessionFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [sequenceNumber, setSequenceNumber] = useState('');
    const [resources, setResources] = useState('');
    const [status, setStatus] = useState('active'); // Default status
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const courseId = window.location.pathname.split('/').pop(); 
    const handleFileChange = (e) => {
        setLessionFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setUploadSuccess(false);
        setUploadError(null);

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
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add JWT token
                }
            });

            if (response.ok) {
                setUploadSuccess(true);
                setTitle('');
                setDescription('');
                setDuration('');
                setSequenceNumber('');
                setResources('');
                setLessionFile(null);
            } else {
                const errorData = await response.json();
                setUploadError(errorData.message || 'Failed to upload lession.');
            }
        } catch (error) {
            setUploadError('An unexpected error occurred.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">Upload Lession</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <form onSubmit={handleSubmit}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                            placeholder="Title"
                                            required
                                        />
                                        <label htmlFor="title" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Title</label>
                                    </div>
                                    <div className="relative mt-4">
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="peer placeholder-transparent h-20 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                            placeholder="Description"
                                            required
                                        ></textarea>
                                        <label htmlFor="description" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Description</label>
                                    </div>
                                    <div className="relative mt-4">
                                        <input
                                            type="number"
                                            id="duration"
                                            name="duration"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                            placeholder="Duration"
                                            required
                                        />
                                        <label htmlFor="duration" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Duration</label>
                                    </div>
                                    <div className="relative mt-4">
                                        <input
                                            type="number"
                                            id="sequenceNumber"
                                            name="sequenceNumber"
                                            value={sequenceNumber}
                                            onChange={(e) => setSequenceNumber(e.target.value)}
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                            placeholder="Sequence Number"
                                            required
                                        />
                                        <label htmlFor="sequenceNumber" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Sequence Number</label>
                                    </div>
                                    <div className="relative mt-4">
                                        <input
                                            type="text"
                                            id="resources"
                                            name="resources"
                                            value={resources}
                                            onChange={(e) => setResources(e.target.value)}
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                            placeholder="Resources"
                                            required
                                        />
                                        <label htmlFor="resources" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Resources</label>
                                    </div>
                                    <div className="relative mt-4">
                                        <select
                                            id="status"
                                            name="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <label htmlFor="status" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Status</label>
                                    </div>
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            id="lession"
                                            name="lession"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            required
                                        />
                                    </div>
                                    {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-600 text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Uploading...' : 'Upload'}
                                        </button>
                                    </div>
                                    {uploadSuccess && <div className="text-green-500 mt-2">Lession uploaded successfully!</div>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadLession;