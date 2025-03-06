import { Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import Loading from "../shared/components/Loading";

const CreateCourse = () => {
    const [formData, setFormData] = useState({
        courseName: "",
        description: "",
        price: "",
        categoryId: "",
        duration: "",
        document: null,
        thumbnail: null,
        demoVideo: null,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Add isLoading state

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true); // Start loading
            try {
                const response = await fetch("http://localhost:8000/courses/get-categories", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error("Failed to fetch categories");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });

            if (name === "thumbnail") {
                const fileReader = new FileReader();
                fileReader.onload = () => setThumbnailPreview(fileReader.result);
                fileReader.readAsDataURL(files[0]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        setIsLoading(true); // Start loading
        try {
            const response = await fetch("http://localhost:8000/courses/", {
                method: "POST",
                body: data,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (response.ok) {
                alert("Course uploaded successfully!");
                setFormData({
                    courseName: "",
                    description: "",
                    price: "",
                    categoryId: "",
                    duration: "",
                    document: null,
                    thumbnail: null,
                    demoVideo: null,
                });
                setThumbnailPreview(null);
            } else {
                alert("Error uploading course.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        } finally {
            setIsLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">Create New Course</h2>
                {isLoading && <Loading/>} {/* Show loader when isLoading is true */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="courseName" className="sr-only">Course Name</label>
                            <input
                                id="courseName"
                                name="courseName"
                                type="text"
                                autoComplete="off"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Course Name"
                                value={formData.courseName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="description" className="sr-only">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm rounded-md"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="price" className="sr-only">Price</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                autoComplete="off"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm rounded-md"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                required
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.categoryId}
                                onChange={handleChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="duration" className="sr-only">Duration (hours)</label>
                            <input
                                id="duration"
                                name="duration"
                                type="number"
                                autoComplete="off"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm rounded-md"
                                placeholder="Duration (hours)"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ... (rest of the form remains the same) */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Upload Document (PDF)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16m-8 0v32m0 0v-8m0 8l10-10M28 8l10 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="document" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="document" name="document" type="file" className="sr-only" onChange={handleFileChange} required />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Upload Thumbnail (Image)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16m-8 0v32m0 0v-8m0 8l10-10M28 8l10 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="thumbnail" name="thumbnail" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} required />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                                {thumbnailPreview && (
                                    <img src={thumbnailPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg shadow" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Upload Demo Video</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16m-8 0v32m0 0v-8m0 8l10-10M28 8l10 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="demoVideo" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="demoVideo" name="demoVideo" type="file" accept="video/*" className="sr-only" onChange={handleFileChange} required />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">MP4, AVI, MOV</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Upload Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;