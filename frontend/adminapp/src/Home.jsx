import React, { useContext, useEffect, useState } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { useHttpClient } from './http-hook';
import Loading from './Loading';
import { toast } from 'react-toastify';

export default function Home() {
  const auth = useContext(AuthContext);
  const [isBlock, setIsBlock] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [description, setDescription] = useState('');
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);  // Empty dependency array means it runs once when the component mounts

  const fetchCourses = async () => {
    try {
      const responseData = await sendRequest('http://localhost:8000/courses/', 'GET', null, {
        'Authorization': auth.authToken,
      });
      setCourses(responseData);
    } catch (err) {}
  };

  const changeStatus = async (id, status) => {
    try {
      // Change the status of the course
      const responseData = await sendRequest(
        `http://localhost:8000/admin/${id}/${status}`,
        'POST',
        JSON.stringify({
          description : status == 'ACTIVE' ? '' : description,
        }),
        {
          'Authorization': `Bearer ${auth.authToken}`,
        }
      );
      toast.success(responseData.message, { autoClose: 1000, hideProgressBar: true });
      fetchCourses();  // Fetch the updated list of courses after changing the status
    } catch (err) {
      toast.error('Failed to change course status. Please try again.');
    }
  };

  // Handle modal actions based on the course and action (Block/Cancel)
  const handleModal = (course, action) => {
    if (action === 'Accept') {
      changeStatus(course.courseId, 'ACTIVE');
    } else {
      setSelectedCourse(course);
      action === 'Block' ? setIsBlock(true) : setIsBlock(false);
    }
  };

  const navigate = useNavigate();
  const handleCardClick = (course) => {
    navigate('/details', { state: { course } });
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <Card
              key={course.courseId}
              data={course}
              onCardClick={handleCardClick}
              onActionClick={handleModal}
            />
          ))}
        </div>
      </div>

      {selectedCourse !== null ? (
        <div className="modal fade" id="blockModal" tabIndex="-1" aria-labelledby="blockModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Course: {selectedCourse.courseName} {isBlock ? 'Block' : 'Cancel'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Course Name:</strong> {selectedCourse.courseName}
                </p>
                <div>
                  <label htmlFor="descriptionInput" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="descriptionInput"
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter reason"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() =>
                    changeStatus(
                      selectedCourse.courseId,
                      isBlock ? 'BLOCK' : 'CANCEL'
                    )
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
