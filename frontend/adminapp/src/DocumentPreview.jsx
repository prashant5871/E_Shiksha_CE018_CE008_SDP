import React, { useState } from 'react';

const DocumentPreview = ({ courseId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  // Function to load the PDF dynamically from the backend
  const loadPdf = async (courseId) => {
    try {
      // Fetch the PDF from the backend
      const response = await fetch(`/api/courses/${courseId}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const pdfBlob = await response.blob(); // Get the PDF blob
      const pdfUrl = URL.createObjectURL(pdfBlob); // Convert it to a URL for iframe
      setPdfUrl(pdfUrl); // Set the URL in the state
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-light">Document Preview</h4>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#pdfModal"
        onClick={() => loadPdf(courseId)} // Load the PDF when the button is clicked
      >
        Open PDF
      </button>

      <div className="modal fade" id="pdfModal" tabIndex="-1" aria-labelledby="pdfModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-secondary">
            <div className="modal-header">
              <h5 className="modal-title" id="pdfModalLabel">PDF Document</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {pdfUrl ? (
                <iframe src={pdfUrl} width="100%" height="500px" title="PDF Document"></iframe>
              ) : (
                <p>Loading PDF...</p> // Show a loading message until the PDF is loaded
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
