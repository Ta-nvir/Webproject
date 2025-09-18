import React, { useState, useEffect } from 'react';

function AreaAddForm() {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [areaName, setAreaName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch city list from backend on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:3000/citylist');
        const data = await response.json();
        if (response.ok) {
          setCities(data);
        } else {
          setError('Failed to fetch cities');
        }
      } catch (err) {
        setError('Something went wrong while fetching cities.');
      }
    };
    fetchCities();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCityId || !areaName.trim()) {
      setError('Please select a city and enter an area name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityid: selectedCityId,
          areaname: areaName.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Area added successfully!');
        setAreaName('');
        setSelectedCityId('');
        setError('');
      } else {
        setError(data.message || 'Failed to add area');
      }
    } catch (err) {
      setError('Error while adding area');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h4 className="mb-3 text-center">Add New Area</h4>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select City</label>
                <select
                  className="form-select"
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                >
                  <option value="">-- Select City --</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Area Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Enter area name"
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Add Area
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AreaAddForm;
