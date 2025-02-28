import React, { useContext, useEffect, useRef, useState } from 'react'
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { useHttpClient } from './http-hook';
import Loading from './Loading';
import { toast } from 'react-toastify';

export default function Home() {
  // const courses = [
  //   {
  //     courseId: 1,
  //     courseName: 'Introduction to React',
  //     description: 'Learn the basics of React, including JSX, components, and state management.',
  //     price: 50.00,
  //     category: { name: 'Web Development' },
  //     lessions: [],
  //     teacher: { name: 'John Doe' },
  //     enrolledStudents: [],
  //     reviews: [],
  //     status: 'Available',
  //     documentUrl: 'https://example.com/document',
  //     //   thumbnail: 'react-course-thumbnail.jpg',
  //     demoVideo: 'https://example.com/demo-video',
  //   },
  //   {
  //     courseId: 2,
  //     courseName: 'JavaScript Basics',
  //     description: 'A beginner-friendly course that covers the fundamentals of JavaScript programming.',
  //     price: 40.00,
  //     category: { name: 'Programming' },
  //     lessions: [],
  //     teacher: { name: 'Jane Smith' },
  //     enrolledStudents: [],
  //     reviews: [],
  //     status: 'Available',
  //     documentUrl: 'https://example.com/document',
  //     thumbnail: 'javascript-course-thumbnail.jpg',
  //     demoVideo: 'https://example.com/demo-video',
  //   },
  //   // Add more courses as needed
  // ];
  const auth = useContext(AuthContext);
  const [isBlock, setIsBlock] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [description, setDescription] = useState('');
  const { isLoading, error, sendRequest, clearError } = useHttpClient();


  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // const url = (auth.isLoggedIn && !auth.isRenter) ? `http://localhost:1204/property/all/${auth.userId}` : 'http://localhost:1204/property/all';
        console.log('nodrre');
        const responseData = await sendRequest('http://localhost:8000/courses/', 'GET', null,
          {
            'Authorization': auth.authToken
          });
        console.log('apthi');

        setCourses(responseData);
        // if(responseData.length > 0)
        //   setSelectedProperty(responseData[0]);
        // else
        //   toast.success("Not any Property Added", {autoClose: 1000, hideProgressBar:true});

        console.log(responseData);
      } catch (err) {
      }
    }
    fetchProperty();
  }, [])
  // const modalref = useRef();
  const handleModal = (course, action) => {
    setSelectedCourse(course);
    action === 'Block' ? setIsBlock(true) : setIsBlock(false);
    // modalref.current.click();
  }

  const changeStatus = async (id, status) => {
    try {
      console.log('working1');
      
      const responseData = await sendRequest(`http://localhost:8000/admin/${id}/${status}`, 'GET', null,
        {
          'Authorization': `Bearer ${auth.authToken}`
        });
        console.log('working 2');
        
      toast.success(responseData.message, { autoClose: 500, hideProgressBar: true });
    } catch { }

  }

  const navigate = useNavigate();
  const handleCardClick = (course) => {
    console.log(course);

    navigate('/details', { state: { course } });
  }
  return (
    <>
      {isLoading && <Loading />}
      <div className="container-fluid">
        <div className="row">

          {courses.map((prop) => (
            <Card key={prop.courseId} data={prop} onCardClick={handleCardClick} onActionClick={handleModal} />
          )
          )}
        </div>
      </div>

      {selectedCourse !== null ? (
        <div className="modal fade" id="blockModal" tabIndex="-1" aria-labelledby="blockModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Course: {selectedCourse.courseName}
                  {isBlock ? 'Block' : 'Cancel'}
                </h5>
                <button
                  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Course Name:</strong> {selectedCourse.courseName}</p>
                <div>
                  <label htmlFor="descriptionInput" className="form-label">Description</label>
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
                {/* <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                  Close
                </button> */}
                <button type="button" className="btn btn-primary" onClick={() => changeStatus(selectedCourse.courseId, (isBlock ? 'BLOCK' : 'CANCEL'))}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

      ) : ''}

    </>
  )
}
