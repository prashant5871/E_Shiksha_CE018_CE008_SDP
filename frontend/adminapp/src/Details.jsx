import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import VideoPlayer from './VideoPlayer';
import { AuthContext } from './auth-context';

const Details = () => {
  const location = useLocation();
  const { course } = location.state;
  const Auth = useContext(AuthContext);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  console.log(course.courseId);

  const loadPdf = async () => {
    try {
      const response = await fetch(`http://localhost:8000/courses/${course.courseId}/pdf`, {
        headers: {
          Authorization: `Bearer ${Auth.authToken}`,
        },
      });

      console.log(response); // Corrected console.log

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      

      const arrayBuffer = await response.arrayBuffer();
      const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfObjectUrl);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Section - Course Details */}
        <div className="col-md-8">
          <div className="card p-4 mb-4 bg-dark text-light">
            <h2 className="text-center">{course.courseName}</h2>

            {/* Demo Video */}
            <div className="mb-4">
              <h4>Demo Video</h4>
              <div className="d-flex justify-content-center">
                <VideoPlayer
                  src={`http://localhost:8000/stream/course/${course.courseId}`}
                />
              </div>
            </div>

            {/* Course Description */}
            <div className="mb-4">
              <h4>Description</h4>
              <p>{course.description}</p>
            </div>

            {/* Author Details */}
            <div className="mb-4">
              <h4>Author: {course.teacher.user.firstName} {course.teacher.user.lastName}</h4>
              <p><strong>Email:</strong> {course.teacher.user.email}</p>
              <p><strong>Status:</strong> {course.teacher.user.enabled ? "Enabled" : "Disabled"}</p>
            </div>

            {/* Price and Category */}
            <div className="mb-4">
              <h4>Price: ₹{course.price}</h4>
              <p><strong>Category:</strong> {course.category.categoryName}</p>
            </div>

            {/* Document Preview */}
            <div className="mb-4">
              <h4>Document Preview</h4>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#pdfModal"
                onClick={loadPdf}
              >
                Open PDF
              </button>

              {/* Modal for PDF Preview */}
              <div className="modal fade" id="pdfModal" tabIndex="-1" aria-labelledby="pdfModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content bg-secondary">
                    <div className="modal-header">
                      <h5 className="modal-title" id="pdfModalLabel">PDF Document</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {/* <div className="modal-body">
                      {pdfUrl ? (
                        <iframe
                          src={pdfUrl}
                          width="100%"
                          height="500px"
                          title="PDF Document"
                          style={{ border: 'none' }}
                        />
                      ) : (
                        <p>Loading PDF...</p>
                      )}
                    </div> */}
                    {/* Optional: Download Button */}
                    
                      <div className="modal-footer">
                        <a href={pdfUrl} download={`course_${course.courseId}.pdf`} className="btn btn-success">
                          Download PDF
                        </a>
                      </div>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-4">
              <button
                className="btn btn-primary"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#reviewsCollapse"
                aria-expanded="false"
                aria-controls="reviewsCollapse"
              >
                {course.reviews && course.reviews.length > 0 ? "Show Reviews" : "No Reviews Available"}
              </button>

              <div className="collapse mt-3" id="reviewsCollapse">
                <div className="card card-body bg-dark text-light">
                  {course.reviews.length === 0 ? (
                    <p>No reviews yet</p>
                  ) : (
                    course.reviews.map((review, index) => (
                      <div key={index} className="mb-2">
                        <p><strong>{review.author}</strong>: {review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Lessons */}
        <div className="col-md-4">
          <div className="card p-4 bg-dark text-light">
            <h4>Lessons</h4>
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              {course.lessions.length === 0 ? (
                <p>No lessons available</p>
              ) : (
                course.lessions.map((lesson, index) => (
                  <div
                    key={index}
                    className="mb-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <h5>Lesson {index + 1}: {lesson.title}</h5>
                  </div>
                ))
              )}
            </div>

            {/* Selected Lesson Video */}
            {selectedLesson && (
              <div className="mt-4">
                <h4>Lesson Video: {selectedLesson.title}</h4>
                <ReactPlayer
                  url={selectedLesson.videoUrl}
                  controls={true}
                  width="100%"
                  height="250px"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
