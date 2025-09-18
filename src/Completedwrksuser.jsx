import React, { useEffect, useState } from 'react';

const Completedwrksuser = () => {

  
  const [workstatuses, setWorkstatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/detailstouser',{
              headers: {
        Authorization: `Bearer ${token}`
      },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWorkstatuses(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  let slno=1
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '600px' }}>
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (workstatuses.length === 0) {
    return (
      <div className="container mt-5">
        <div className="card shadow">
          <div className="card-body text-center py-5">
            <h3 className="text-muted">No completed work found</h3>
            <p className="text-muted">There are no work records to display at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0 text-center">Completed Work Status</h2>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-nowrap">Status ID</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th className="text-nowrap">Bill Number</th>
                  <th className="text-nowrap">Status</th>
                  <th>Fees</th>
                  <th className="text-nowrap">User Name</th>
                  <th className="text-nowrap">Employee</th>
                </tr>
              </thead>
              <tbody>
                {workstatuses.map((item) => (
                  <tr key={item.statusid}>
                    <td className="fw-bold">{slno++}</td>
                    <td>
                      <img
                        src={`http://localhost:5000${item.imagepath}`}
                        alt="Work"
                        className="img-thumbnail"
                        style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100x80?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="text-wrap" style={{ maxWidth: '200px' }}>
                      {item.work_description}
                    </td>
                    <td>{item.Billnumber}</td>
                    <td>
                      <span 
                        className={`badge ${
                          item.request_status === 'Completed' 
                            ? 'bg-success' 
                            : item.request_status === 'Pending'
                            ? 'bg-warning text-dark'
                            : 'bg-secondary'
                        }`}
                      >
                        {item.request_status}
                      </span>
                    </td>
                    <td className="fw-bold">₹{item.Fees}</td>
                    <td>{item.username}</td>
                    <td>{item.empname}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing {workstatuses.length} records
            </small>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completedwrksuser;