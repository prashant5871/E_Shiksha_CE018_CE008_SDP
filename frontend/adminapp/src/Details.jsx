import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

// React player to handle demo video
import ReactPlayer from 'react-player';

// PDF preview component
import { Document, Page } from 'react-pdf';

const Details = () => {
  const location = useLocation();
  const { course } = location.state; // Get the course data from the location's state

  // For toggling reviews section visibility
  const [showReviews, setShowReviews] = useState(false);

  // For lessons handling
  const [selectedLesson, setSelectedLesson] = useState(null);

  return (
    <div className="container mt-5 text-light">
      <div className="row">
        {/* Left Section - Course Details */}
        <div className="col-md-8">
          <div className="card p-4 text-light bg-dark">
            {/* Course Name */}
            <h2 className="text-center">{course.courseName}</h2>

            {/* Demo Video */}
            <div className="mb-4">
              <h4>Demo Video</h4>
              <div className="d-flex justify-content-center">
                <ReactPlayer
                  // url={course.demoVideo} 
                  url="demo.mp4"
                  controls={true}
                  width="100%"
                  height="300px"
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

            PDF Document Preview
            <div className="mb-4">
              <h4>Document Preview</h4>
            </div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pdfModal">
              Open PDF
            </button>
            <div className="modal fade" id="pdfModal">
              <div className="modal-dialog modal-lg">
                <div className="modal-content bg-secondary">
                  <div className="modal-header">
                    <h5 className="modal-title">PDF Document</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <iframe src="demopdf.pdf" width="100%" height="500px"></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section
            <div className="mb-4">
              <button 
                className="btn btn-primary" 
                onClick={() => setShowReviews(!showReviews)}
              >
                {showReviews ? "Hide Reviews" : "Show Reviews"}
              </button>
              {showReviews && (
                <div className="mt-3" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
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
              )}
            </div> */}
            <div className="mb-4">
              {/* Button to toggle the review section */}
                {/* Button to toggle the review section */}
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

                {/* Collapse section for reviews */}
                <div className="collapse mt-3" id="reviewsCollapse">
                  <div className="card card-body">
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
            <div className="card p-4 text-light bg-dark">
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
