import React, { useEffect, useState } from 'react';

function RequestStatusForUser() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:3000/ReuqestStatusForUSers', {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error(err));
  }, []);

  const handlePaymentClick = (request) => {
    setSelectedRequest(request);
    setCardName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setError('');
    setShowModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setError('All fields are required');
      return;
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      setError('Card number must be 16 digits');
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError('CVV must be 3 or 4 digits');
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch('http://localhost:3000/payAndBook', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          requestid: selectedRequest.requestid,
          maidid: selectedRequest.maidid,
          amount: selectedRequest.fees,
          cardholder: cardName,
          cardnumber: cardNumber,
          expiry,
          cvv
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Payment successful!');
        setShowModal(false);
        window.location.reload();
      } else {
        setError(data.message || 'Payment failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Mechanical Work Requests</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Sl No</th>
              <th>Mechanical Name</th>
              <th>Phone</th>
              <th>Work Details</th>
              <th>Fees</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{req.name}</td>
                  <td>{req.phone}</td>
                  <td>{req.Description}</td>
                  <td>{req.fees}</td>
                  <td>
                    <span className={`badge text-uppercase p-2 ${req.status === 'Available' ? 'bg-success' : req.status === 'booked' ? 'bg-primary' : 'bg-secondary'}`}>
                      {req.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {req.status !== 'booked' && (
                      <button className="btn btn-sm text-white btn-primary" onClick={() => handlePaymentClick(req)}>
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Pay Maid Fees</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Cardholder Name</label>
                  <input type="text" className="form-control" value={cardName} onChange={e => setCardName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input type="text" maxLength="16" className="form-control" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiry Date (MM/YY)</label>
                    <input type="text" className="form-control" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV</label>
                    <input type="password" maxLength="4" className="form-control" value={cvv} onChange={e => setCvv(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success text-white" onClick={handlePaymentSubmit}>Pay ₹{selectedRequest?.fees}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestStatusForUser;
