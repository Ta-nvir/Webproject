import React, { useEffect, useState } from 'react';

function BookedEmpQuery() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    fetch('http://localhost:5000/compliants', {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleFeedbackClick = (request) => {
    setSelectedRequest(request);
    setFeedbackText('');
    setError('');
    setShowFeedbackModal(true);
  };

  const handleStopClick = (request) => {
    setSelectedRequest(request);
    setFeedbackText('');
    setError('');
    setShowStopModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText) {
      setError("Feedback can't be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch('http://localhost:5000/addFeedback', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          requestid: selectedRequest.requestid,
          empid: selectedRequest.empid,
          feedback: feedbackText
        })
      });

      if (res.ok) {
        alert("Feedback submitted.");
        setShowFeedbackModal(false);
      } else {
        const data = await res.json();
        setError(data.message || "Error submitting feedback");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const handleStopServiceSubmit = async () => {
    if (!feedbackText) {
      setError("Feedback is required to stop service.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch('http://localhost:5000/stopService', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          requestid: selectedRequest.requestid,
          empid: selectedRequest.empid,
          feedback: feedbackText
        })
      });

      if (res.ok) {
        alert("Service stopped and feedback submitted.");
        setShowStopModal(false);
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.message || "Error stopping service");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const renderModal = (show, title, onClose, onSubmit, buttonText, buttonVariant = 'primary') => (
    show && (
      <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-gradient-primary text-white">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label fw-bold">Feedback</label>
                <textarea
                  className="form-control border-2"
                  rows="4"
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Write your feedback here"
                  style={{ minHeight: '120px' }}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                Cancel
              </button>
              <button 
                className={`btn btn-${buttonVariant} rounded-pill px-4 shadow-sm`}
                onClick={onSubmit}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h3 className="mb-0 text-center fw-bold text-primary">
            <i className="fas fa-comments me-2"></i>Service Feedback
          </h3>
        </div>
        
        <div className="card-body px-0 pb-0">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your service requests...</p>
            </div>
          ) : requests.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="ps-4">#</th>
                    <th scope="col">Maid Name</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Service Details</th>
                    <th scope="col">Fees</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr key={index} className="border-top">
                      <td className="ps-4 fw-medium">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
                            <i className="fas fa-user text-muted"></i>
                          </div>
                          <span>{req.name}</span>
                        </div>
                      </td>
                      <td>
                        <a href={`tel:${req.phone}`} className="text-decoration-none">
                          <i className="fas fa-phone-alt me-2 text-muted"></i>
                          {req.phone}
                        </a>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '200px' }} title={req.Description}>
                        {req.Description}
                      </td>
                      <td className="fw-bold">₹{req.fees}</td>
                      <td>
                        <span className={`badge rounded-pill bg-${req.status === 'active' ? 'success' : 'secondary'} bg-opacity-10 text-${req.status === 'active' ? 'success' : 'secondary'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2"
                          onClick={() => handleFeedbackClick(req)}
                        >
                          <i className="fas fa-comment me-1"></i> Feedback
                        </button>
                        {/* <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleStopClick(req)}
                        >
                          <i className="fas fa-stop-circle me-1"></i> Stop
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-inbox fa-3x text-muted"></i>
              </div>
              <h5 className="text-muted">No service requests found</h5>
              <p className="text-muted">You don't have any active service requests at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {renderModal(showFeedbackModal, 'Submit Feedback', 
        () => setShowFeedbackModal(false), 
        handleFeedbackSubmit, 
        'Submit Feedback'
      )}
      
      {renderModal(showStopModal, 'Stop Service', 
        () => setShowStopModal(false), 
        handleStopServiceSubmit, 
        'Stop Service', 
        'danger'
      )}
    </div>
  );
}

export default BookedEmpQuery;