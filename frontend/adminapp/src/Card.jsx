import React from 'react';

export default function Card(props) {

  // const baseUrl = 'http://localhost:1204/images/';

  return (
    <div className="col-md-6">
      <div className="card m-2">
        <div className="row g-0">
          {/* Left Column - Image and Text */}
          <div className="col-md-5" onClick={() => props.onCardClick(props.data)}>
            <img
              // src={props.data.thumbnail ? `${props.data.thumbnail}` : "image.png"}
              src="image.png"
              className="img-fluid rounded-start w-100 h-100"
              alt={props.data.courseName}
            />
          </div>

          {/* Middle Column - Course Information */}
          <div className="col-md-5 text-capitalize">
            <div className="card-body" onClick={() => props.onCardClick(props.data)}>
              <h5 className="card-title">{props.data.courseName}</h5>
              <h5 className="fw-lighter small">by {props.data.teacher.user.firstName} {props.data.teacher.user.lastName}</h5>
              <p className="card-text">{props.data.description}</p>

              <div className='row g-0'>
                <div className='col-md-8'>
                  <h6> Duration : 18<small className='fw-light text-lowercase'> hour</small></h6>
                  <span className='bg-warning p-1'>
                    Price: ₹{props.data.price}
                    {/* <small className='fw-light text-lowercase'>/course</small> */}
                  </span>
                  {/* <span className="small m-2">
                Teacher: {props.data.teacher.name}
              </span> */}
                  <p className="card-text">
                    <small className="text-warning p-1 rounded-5 bg-secondary">
                      {/* {props.data.reviews.length > 0 ? props.data.reviews.join(', ') : "No reviews yet"} */}
                      #{props.data.category.categoryName}
                    </small>
                  </p>
                </div>
                <div className='col-md-3 fw-lighter text-center'>
                  {props.data.teacher.user.reviews.length} Reviews
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Buttons */}
          <div className="border-start col-md-2 d-flex flex-column justify-content-center align-items-center">
            <strong className='text-warning mb-4'>{props.data.status}</strong>
            <button className='btn btn-outline-success mb-2'>
              Accept
            </button>
            <button className='btn btn-outline-danger mb-2' onClick={() => props.onActionClick(props.data, 'Block')} data-bs-toggle="modal" data-bs-target="#blockModal" >
              Block
            </button>
            <button className='btn btn-outline-primary mb-2' onClick={() => props.onActionClick(props.data, 'Cancel')} data-bs-toggle="modal" data-bs-target="#blockModal">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
