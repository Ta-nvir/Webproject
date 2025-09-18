import React, { useEffect, useState } from 'react';

function Myworks() {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [showModal, setShowModal] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  useEffect(() => {
    fetch('http://localhost:3000/myWorks', {
      headers: getAuthHeaders(),
    })
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error(err));
  }, []);

  const refreshRequests = () => {
    fetch('http://localhost:3000/myWorks', {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error("Refresh error:", err));
  };

  const openModal = (requestId) => {
    setSelectedRequestId(requestId);
    setBillNumber(`BILL-${Date.now()}`);
    setShowModal(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmitWork = async () => {
    if (!description || !image || !billNumber) {
      return alert("Please fill all fields and upload an image.");
    }

    const formData = new FormData();
    formData.append('requestid', selectedRequestId);
    formData.append('description', description);
    formData.append('billnumber', billNumber);
    formData.append('image', image);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch('http://localhost:3000/submitwork', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.text();
      alert(result.message);

     

      setShowModal(false);
      setDescription('');
      setImage(null);
      setImagePreview('');
      setSelectedRequestId(null);
      refreshRequests();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  let slno = 1;

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Assigned Works</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Slno</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Work Details</th>
              <th>Fees</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <tr key={index}>
                  <td>{slno++}</td>
                  <td>{req.firstname} {req.lastname}</td>
                  <td>{req.email}</td>
                  <td>{req.userMobile}</td>
                  <td>{req.Description}</td>
                  <td>{req.Fees}</td>
                  <td>
                    <span className={`badge p-2 text-uppercase ${req.status === 'Completed' ? 'bg-success' : 'bg-secondary'}`}>
                      {req.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {req.status !== 'Completed' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openModal(req.requestid)}
                      >
                        Attend
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Submit Work</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Description</label>
                  <textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label>Upload Image (Drag & Drop or Select)</label>
                  <div
                    className="border p-3 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    style={{ cursor: 'pointer', background: '#f9f9f9' }}
                  >
                    {imagePreview ? (
                      <div>
                        <img src={imagePreview} alt="preview" height="100" />
                        <br />
                        <button className="btn btn-sm btn-danger mt-2" onClick={handleRemoveImage}>Remove</button>
                      </div>
                    ) : (
                      <>
                        <p>Drag and drop an image here, or click below to upload.</p>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                      </>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label>Bill Number</label>
                  <input type="text" className="form-control" value={billNumber} readOnly />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleSubmitWork}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myworks;
