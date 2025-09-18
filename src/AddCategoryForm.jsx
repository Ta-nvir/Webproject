import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AddCategoryForm() {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    if (categoryName.trim().length < 3) {
      setError('Category name must be at least 3 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/maidcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryname: categoryName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Category added successfully!');
        setCategoryName('');
      } else {
        setError(data.message || 'Error adding category');
      }
    } catch (err) {
      setError('Something went wrong while adding the category');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-5 shadow w-50 mx-auto">
        
        <h4 className="mb-3 text-center">Add Maid Category</h4>
          <Link to='/catList' className="btn btn-primary w-50">Catgoerys List</Link>
      <hr />
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
          
            <input
              type="text"
              id="categoryName"
              className="form-control form-control-lg"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Cooking"
            />
          </div>
          <button type="submit" className="btn btn-primary me-5 w-50 text-white">Add Category</button>
        
        </form>
      </div>
    </div>
  );
}

export default AddCategoryForm;
