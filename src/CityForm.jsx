import React, { useState } from 'react';
import './assets/style.css';
import { Link } from 'react-router-dom';

function CityForm() {
  // State to hold the city name
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(''); // State to hold error messages

  // Function to handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) {
      setError("City name cannot be empty");
      return;
    }
    setError(''); // Clear any previous error messages
    insertCity(cityName);
  };

  // Function to send the city data to the backend API
  const insertCity = async (cityName) => {
    setLoading(true); // Set loading state to true while waiting for API response
    try {
      const response = await fetch('http://localhost:3000/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city_name: cityName }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('City added successfully!');
        setCityName(''); // Clear the input field after successful submission
      } else {
        setError(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error inserting city:', error);
      setError('Something went wrong! Please try again.');
    } finally {
      setLoading(false); // Set loading state to false once the API request is complete
    }
  };

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow fade-in p-5">
              <div className="card-body">
                <h3 className="text-center mb-4">Register Your City</h3>
                <Link to="/cityOperations" className='btn btn-primary'>CityList</Link>
                <hr />
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="cityName"
                      placeholder="Enter city name"
                      required
                      value={cityName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Registering...' : 'Register City'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityForm;
