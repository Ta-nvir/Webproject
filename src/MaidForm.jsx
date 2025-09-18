import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaVenusMars, FaCalendarAlt, FaBriefcase, FaCity, FaMapMarkerAlt, FaImage, FaTrash, FaLock, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import './MaidForm.css'; // We'll create this CSS file next

function MaidForm() {
  const [maid, setMaid] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    experience: '',
    cityid: '',
    areaid: '',
    description: '',
    emailid: '',
    password: '',
    categoryid: '',
    profile: null,
  });

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3000/maidcategory');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories.');
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (maid.cityid) {
      fetchAreas(maid.cityid);
    } else {
      setAreas([]);
    }
  }, [maid.cityid]);

  const fetchCities = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/cities');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      setError('Failed to load cities.');
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/areas/${cityId}`);
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      setError('Failed to load areas.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile' && files && files.length > 0) {
      const file = files[0];
      setMaid((prev) => ({ ...prev, profile: file }));
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setMaid((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const removeProfileImage = () => {
    setMaid((prev) => ({ ...prev, profile: null }));
    setProfilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!maid.name || !maid.cityid || !maid.areaid || !maid.emailid || !maid.password) {
      setError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    for (let key in maid) {
      if (maid[key] !== null && maid[key] !== '') {
        formData.append(key, maid[key]);
      }
    }

    try {
      const res = await fetch('http://localhost:3000/addMaids', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed.');
      }

      setSuccess('Worker added successfully!');
      setMaid({
        name: '',
        age: '',
        gender: '',
        phone: '',
        experience: '',
        cityid: '',
        areaid: '',
        description: '',
        emailid: '',
        password: '',
        categoryid: '',
        profile: null,
      });
      setProfilePreview(null);
    } catch (err) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="maid-form-container">
      <motion.div 
        className="maid-form-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="form-header"
          variants={itemVariants}
        >
          <h2>Register New Worker</h2>
          <p>Fill in the details to add a new worker to the system</p>
        </motion.div>

        {error && (
          <motion.div 
            className="alert error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="alert success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Personal Information */}
            <motion.div className="form-section" variants={itemVariants}>
              <h3><FaUser /> Personal Information</h3>
              <div className="input-group">
                <label>
                  <FaUser className="input-icon" />
                  Full Name *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={maid.name} 
                  onChange={handleChange} 
                  placeholder="Enter full name"
                  required 
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>
                    <FaCalendarAlt className="input-icon" />
                    Age
                  </label>
                  <input 
                    type="number" 
                    name="age" 
                    value={maid.age} 
                    onChange={handleChange} 
                    placeholder="Age"
                    min="18"
                    max="70"
                  />
                </div>

                <div className="input-group">
                  <label>
                    <FaVenusMars className="input-icon" />
                    Gender
                  </label>
                  <select name="gender" value={maid.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>
                  <FaPhone className="input-icon" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={maid.phone} 
                  onChange={handleChange} 
                  placeholder="Phone number"
                />
              </div>
            </motion.div>

            {/* Work Information */}
            <motion.div className="form-section" variants={itemVariants}>
              <h3><FaBriefcase /> Work Information</h3>
              <div className="input-group">
                <label>
                  <FaBriefcase className="input-icon" />
                  Experience (years)
                </label>
                <input 
                  type="number" 
                  name="experience" 
                  value={maid.experience} 
                  onChange={handleChange} 
                  placeholder="Years of experience"
                  min="0"
                  max="50"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaInfoCircle className="input-icon" />
                  Category *
                </label>
                <select 
                  name="categoryid" 
                  value={maid.categoryid} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryid} value={cat.categoryid}>
                      {cat.categoryname}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Location Information */}
            <motion.div className="form-section" variants={itemVariants}>
              <h3><FaMapMarkerAlt /> Location Information</h3>
              <div className="input-group">
                <label>
                  <FaCity className="input-icon" />
                  City *
                </label>
                <select 
                  name="cityid" 
                  value={maid.cityid} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>
                  <FaMapMarkerAlt className="input-icon" />
                  Area *
                </label>
                <select 
                  name="areaid" 
                  value={maid.areaid} 
                  onChange={handleChange} 
                  required
                  disabled={!maid.cityid}
                >
                  <option value="">Select area</option>
                  {areas.map((area) => (
                    <option key={area.areaid} value={area.areaid}>
                      {area.areaname}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Account Information */}
            <motion.div className="form-section" variants={itemVariants}>
              <h3><FaLock /> Account Information</h3>
              <div className="input-group">
                <label>
                  <FaEnvelope className="input-icon" />
                  Email *
                </label>
                <input 
                  type="email" 
                  name="emailid" 
                  value={maid.emailid} 
                  onChange={handleChange} 
                  placeholder="Email address"
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  <FaLock className="input-icon" />
                  Password *
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={maid.password} 
                  onChange={handleChange} 
                  placeholder="Create password"
                  required
                />
              </div>
            </motion.div>

            {/* Profile Photo */}
            <motion.div className="form-section" variants={itemVariants}>
              <h3><FaImage /> Profile Photo</h3>
              <div className="input-group">
                <label>
                  <FaImage className="input-icon" />
                  Upload Photo
                </label>
                <div className="file-upload">
                  <label className="upload-btn">
                    Choose File
                    <input 
                      type="file" 
                      name="profile" 
                      accept="image/*" 
                      onChange={handleChange} 
                      hidden
                    />
                  </label>
                  {maid.profile ? (
                    <span className="file-name">{maid.profile.name}</span>
                  ) : (
                    <span className="file-name">No file chosen</span>
                  )}
                </div>
                {profilePreview && (
                  <div className="image-preview">
                    <img src={profilePreview} alt="Profile preview" />
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={removeProfileImage}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div className="form-section full-width" variants={itemVariants}>
              <h3><FaInfoCircle /> Additional Information</h3>
              <div className="input-group">
                <label>
                  <FaInfoCircle className="input-icon" />
                  Description
                </label>
                <textarea 
                  name="description" 
                  value={maid.description} 
                  onChange={handleChange} 
                  placeholder="Worker's skills, experience, availability, etc."
                  rows="4"
                ></textarea>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="form-actions"
            variants={itemVariants}
          >
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Worker'}
              {isSubmitting && <div className="spinner"></div>}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default MaidForm;