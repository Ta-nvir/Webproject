import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaStar, FaRegStar, FaUser, FaPhone, FaEnvelope, FaVenusMars, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import './MaidProfiles.css';

const MaidProfiles = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMaidId, setSelectedMaidId] = useState(null);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoryid: "",
    minAge: "",
    maxAge: "",
    minExp: "",
    maxExp: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch maid data
  useEffect(() => {
    const getData = async () => {
      const response = await fetch("http://localhost:3000/maidProfile");
      const result = await response.json();
      setUsers(result);
      setFilteredUsers(result);
    };
    getData();
  }, []);

  // Fetch category data
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:3000/maidcategory");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...users];
    const { categoryid, minAge, maxAge, minExp, maxExp } = filters;

    if (categoryid) {
      filtered = filtered.filter(user => user.categoryid == categoryid);
    }
    if (minAge) {
      filtered = filtered.filter(user => user.age >= parseInt(minAge));
    }
    if (maxAge) {
      filtered = filtered.filter(user => user.age <= parseInt(maxAge));
    }
    if (minExp) {
      filtered = filtered.filter(user => user.experience >= parseInt(minExp));
    }
    if (maxExp) {
      filtered = filtered.filter(user => user.experience <= parseInt(maxExp));
    }
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [filters, users, searchTerm]);

  const handleRequest = (maidId) => {
    setSelectedMaidId(maidId);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/requestMaid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          maidid: selectedMaidId,
          description: description
        })
      });

      const result = await response.json();
      if (response.status === 200) {
        alert("Request sent successfully!");
        setShowModal(false);
        setDescription("");
      } else {
        alert(result.message || "Failed to send request.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-warning" />
        ) : (
          <FaRegStar key={i} className="text-warning" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="maid-profiles-container">
      <div className="header-section">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="main-title"
        >
          Find Your Perfect Maid
        </motion.h1>
        <p className="subtitle">Browse through our verified and professional maids</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="filter-controls"
            >
              <div className="filter-grid">
                <div className="filter-group">
                  <label>Category</label>
                  <select 
                    value={filters.categoryid} 
                    onChange={e => setFilters({ ...filters, categoryid: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryid} value={cat.categoryid}>
                        {cat.categoryname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Age Range</label>
                  <div className="range-inputs">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.minAge} 
                      onChange={e => setFilters({ ...filters, minAge: e.target.value })} 
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.maxAge} 
                      onChange={e => setFilters({ ...filters, maxAge: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label>Experience (years)</label>
                  <div className="range-inputs">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.minExp} 
                      onChange={e => setFilters({ ...filters, minExp: e.target.value })} 
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.maxExp} 
                      onChange={e => setFilters({ ...filters, maxExp: e.target.value })} 
                    />
                  </div>
                </div>

                <button 
                  className="clear-filters"
                  onClick={() => {
                    setFilters({ categoryid: "", minAge: "", maxAge: "", minExp: "", maxExp: "" });
                    setSearchTerm("");
                  }}
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Maid Cards */}
      <div className="maid-cards-container">
        {filteredUsers.length > 0 ? (
          <div className="maid-cards-grid">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.empid}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  className="maid-card"
                >
                  <div className="card-header">
                    <div className="profile-image-container">
                      <img
                        src={`http://localhost:3000/uploads/EmpImages/${user.profile}`}
                        alt={user.name}
                        className="profile-image"
                      />
                      {/* <div className="rating">{renderStars(user.rating || 4)}</div> */}
                    </div>
                    <h3 className="maid-name">{user.name}</h3>
                    <p className="maid-category">
                      {categories.find(cat => cat.categoryid == user.categoryid)?.categoryname || "General Maid"}
                    </p>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <FaUser className="icon" />
                      <span>{user.age} years</span>
                    </div>
                    <div className="info-row">
                      <FaVenusMars className="icon" />
                      <span>{user.gender}</span>
                    </div>
                    <div className="info-row">
                      <FaCalendarAlt className="icon" />
                      <span>{user.experience} years experience</span>
                    </div>
                    <div className="info-row">
                      <FaPhone className="icon" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="info-row">
                      <FaEnvelope className="icon" />
                      <span>{user.emailid}</span>
                    </div>

                    <div className="description">
                      <FaInfoCircle className="icon" />
                      <p>{user.description || "No additional information provided."}</p>
                    </div>
                  </div>

                  <button 
                    className="request-button"
                    onClick={() => handleRequest(user.empid)}
                  >
                    Request Service
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-results"
          >
            <h3>No maids found matching your criteria</h3>
            <button 
              className="reset-filters"
              onClick={() => {
                setFilters({ categoryid: "", minAge: "", maxAge: "", minExp: "", maxExp: "" });
                setSearchTerm("");
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Send Service Request</h3>
              <p>Please describe your requirements:</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Need daily cleaning from 9am-12pm, must be good with pets..."
                rows={5}
              />
              <div className="modal-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={!description.trim()}
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaidProfiles;