import React, { useEffect, useState } from 'react';

function MaidRequestTable() {
  const [requests, setRequests] = useState([]);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [feeInputs, setFeeInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    fetch('http://localhost:3000/requesttoAdmin')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleStatusUpdate = (requestId, newStatus, fees = null) => {
    if (newStatus === 'Available') {
      if (!fees || isNaN(fees) || Number(fees) <= 0) {
        alert('Please enter a valid fee amount');
        return;
      }
    }

    setIsLoading(true);
    fetch('http://localhost:3000/updaterequeststatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestid: requestId, status: newStatus, fees }),
    })
      .then(res => res.text())
      .then(() => {
        fetchData();
        setEditingRequestId(null);
        setFeeInputs({});
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.firstname?.toLowerCase().includes(searchLower) ||
      request.lastname?.toLowerCase().includes(searchLower) ||
      request.email?.toLowerCase().includes(searchLower) ||
      request.userMobile?.includes(searchTerm) ||
      request.Description?.toLowerCase().includes(searchLower) ||
      request.name?.toLowerCase().includes(searchLower) ||
      request.phone?.includes(searchTerm) ||
      request.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container py-4">
      <div className="card shadow-lg">
        <div className="card-header text-white" style={{ backgroundColor: "#00346b" }}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">User Requests Management</h3>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading requests...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>User Details</th>
                    <th>Work Details</th>
                    <th>Worker Details</th>
                     <th>Fees</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="fw-semibold">{req.firstname} {req.lastname}</div>
                        <div className="text-muted small">{req.email}</div>
                        <div className="text-muted small">{req.userMobile}</div>
                      </td>
                      <td>{req.Description}</td>
                      <td>
                        <div className="fw-semibold">{req.name}</div>
                        <div className="text-muted small">{req.phone}</div>
                      </td>
                      <td>
                        <div className="fw-semibold">{req.Fees}</div>
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${
                          req.status === 'Available' ? 'bg-success' :
                          req.status === 'Not Available' ? 'bg-danger' :
                          'bg-warning text-dark'
                        }`}>
                          {req.status || 'Pending'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end align-items-center">
                          {editingRequestId === req.requestid ? (
                            <>
                              <input
                                type="number"
                                placeholder="₹ Fee"
                                className="form-control form-control-sm"
                                style={{ width: '100px' }}
                                value={feeInputs[req.requestid] || ''}
                                onChange={(e) =>
                                  setFeeInputs({ ...feeInputs, [req.requestid]: e.target.value })
                                }
                              />
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleStatusUpdate(
                                  req.requestid,
                                  'Available',
                                  feeInputs[req.requestid]
                                )}
                                disabled={isLoading}
                              >
                                Confirm
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setEditingRequestId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => setEditingRequestId(req.requestid)}
                                disabled={req.status === 'Available' || req.status === 'Completed'}
                              >
                                <i className="bi bi-check-circle me-1"></i> Available
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleStatusUpdate(req.requestid, 'Not Available')}
                                disabled={req.status === 'Not Available'}
                              >
                                <i className="bi bi-x-circle me-1"></i> Not Available
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              <h5 className="mt-3">No requests found</h5>
              {searchTerm && (
                <button
                  className="btn btn-link"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaidRequestTable;
