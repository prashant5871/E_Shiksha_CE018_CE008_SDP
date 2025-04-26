import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";

const UpdateCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch course");

        const data = await response.json();
        setCourse(data);
        setFormData({
          courseName: data.courseName,
          description: data.description,
          price: data.price,
          duration: data.duration,
          category: data.category ? data.category.id : "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/courses/get-categories`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourse();
    fetchCategories();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/courses/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update course");

      navigate("/manage-courses");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Update Course
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Name */}
          <div>
            <label className="block text-gray-700 font-medium">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

        

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-medium">Duration (days)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
