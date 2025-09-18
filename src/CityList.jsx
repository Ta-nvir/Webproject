import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa'; // Import icons from react-icons

function CityList() {
  // States for handling cities, loading, and error messages
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch cities from the backend when component mounts
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch the cities from the backend
  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/citylist');
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setCities(data);
      } else {
        setError(data.message || 'Error fetching cities');
      }
    } catch (error) {
      setError('Something went wrong while fetching cities.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle city name input change
  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  // Function to handle update city operation
  const handleUpdate = async (cityId) => {
    if (!cityName.trim()) {
      alert('City name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/cities/${cityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city_name: cityName }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('City updated successfully!');
        fetchCities(); // Refresh the list of cities
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      setError('Something went wrong while updating city.');
    } finally {
      setLoading(false);
    }
  };

  console.log(cities)
  // Function to handle delete city operation
  const handleDelete = async (cityId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this city?');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/cities/${cityId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('City deleted successfully!');
        fetchCities(); // Refresh the list of cities
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      setError('Something went wrong while deleting city.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card shadow fade-in p-5">
              <div className="card-body">
                <h3 className="text-center mb-4">City Operations</h3>
                <hr />

                {/* Success or Error message */}
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Table to display cities */}
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>City Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.length === 0 ? (
                      <tr>
                        <td colSpan="2">No cities available.</td>
                      </tr>
                    ) : (
                      cities.map((city) => (
                        <tr key={city.city_id}>
                          <td>
                            {selectedCity?.city_id === city.city_id ? (
                              <input
                                type="text"
                                className="form-control"
                                value={cityName}
                                onChange={handleInputChange}
                              />
                            ) : (
                              city.city_name
                            )}
                          </td>
                          <td>
                            {selectedCity?.city_id === city.city_id ? (
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleUpdate(city.city_id)}
                                disabled={loading}
                              >
                                {loading ? <FaSave /> : <FaSave />}
                              </button>
                            ) : (
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => {
                                  setSelectedCity(city);
                                  setCityName(city.city_name);
                                }}
                              >
                                <FaEdit />
                              </button>
                            )}

                            <button
                              className="btn btn-danger btn-sm mx-2"
                              onClick={() => handleDelete(city.city_id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityList;
