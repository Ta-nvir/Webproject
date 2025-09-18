import React, { useState, useEffect } from 'react';

function CatgoeryList() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/maidcategory');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories.');
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/maidcategory/${editingId}`
        : 'http://localhost:5000/api/maidcategory';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryname: categoryName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Operation failed.');
        return;
      }

      setCategoryName('');
      setEditingId(null);
      fetchCategories();
      setError('');
    } catch (err) {
      setError('Server error.');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.categoryid);
    setCategoryName(category.categoryname);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/maidcategory/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Delete failed.');
        return;
      }

      fetchCategories();
    } catch (err) {
      setError('Delete failed.');
    }
  };

  const handleCategoryUpdate = async (id) => {
    if (!categoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/maidcategory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryname: categoryName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Update failed.');
        return;
      }

      setEditingId(null);
      setCategoryName('');
      fetchCategories();
    } catch (err) {
      setError('Update failed.');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center">Manage Maid Categories</h3>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Category Table */}
      <div className="card shadow p-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryid}>
                <td>
                  {editingId === category.categoryid ? (
                    <input
                      type="text"
                      className="form-control"
                      value={categoryName}
                      onChange={handleCategoryChange}
                    />
                  ) : (
                    category.categoryname
                  )}
                </td>
             <td>
  {editingId === category.categoryid ? (
    <button
      className="btn btn-warning btn-sm"
      onClick={() => handleCategoryUpdate(category.categoryid)}
      title="Save"
    >
      <i className="fas fa-save"></i>
    </button>
  ) : (
    <button
      className="btn btn-info btn-sm w-25 text-white"
      onClick={() => handleEdit(category)}
      title="Edit"
    >
      <i className="fas fa-edit"></i>
    </button>
  )}
  <button
    className="btn btn-danger btn-sm mx-2 w-25 text-white"
    onClick={() => handleDelete(category.categoryid)}
    title="Delete"
  >
    <i className="fas fa-trash-alt"></i>
  </button>
</td>
  
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CatgoeryList;
