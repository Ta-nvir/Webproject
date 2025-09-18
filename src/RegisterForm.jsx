import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserCircle } from 'react-icons/fa';
import styles from './assets/RegisterForm.module.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [e.target.name]: ''
    }));
  };

  const validateForm = () => {
    const { firstname, lastname, email, phone, password } = formData;
    let valid = true;
    let validationErrors = { ...errors };

    const nameRegex = /^[A-Za-z]{1,20}$/;
    if (!nameRegex.test(firstname)) {
      validationErrors.firstname = 'First Name must contain only letters (max 20)';
      valid = false;
    }
    if (!nameRegex.test(lastname)) {
      validationErrors.lastname = 'Last Name must contain only letters (max 20)';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address';
      valid = false;
    }

    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      validationErrors.phone = 'Enter a valid 10-digit Indian phone number';
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      validationErrors.password = 'Must include: lowercase, uppercase, number, special character (min 6)';
      valid = false;
    }

    setErrors(validationErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Registration successful! You can now login.");
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          password: '',
          role: 'user'
        });
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
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
    <div className={styles.registerContainer}>
      <motion.div 
        className={styles.registerForm}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className={styles.formHeader}
          variants={itemVariants}
        >
          <FaUserCircle className={styles.headerIcon} />
          <h2>Create Account</h2>
          <p>Join us today and find your perfect home service</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className={styles.nameFields}>
            <motion.div 
              className={styles.inputGroup}
              variants={itemVariants}
            >
              <label htmlFor="firstname">
                <FaUser className={styles.inputIcon} />
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="John"
                value={formData.firstname}
                onChange={handleChange}
                className={errors.firstname ? styles.errorInput : ''}
                required
              />
              {errors.firstname && <span className={styles.errorText}>{errors.firstname}</span>}
            </motion.div>

            <motion.div 
              className={styles.inputGroup}
              variants={itemVariants}
            >
              <label htmlFor="lastname">
                <FaUser className={styles.inputIcon} />
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Doe"
                value={formData.lastname}
                onChange={handleChange}
                className={errors.lastname ? styles.errorInput : ''}
                required
              />
              {errors.lastname && <span className={styles.errorText}>{errors.lastname}</span>}
            </motion.div>
          </div>

          <motion.div 
            className={styles.inputGroup}
            variants={itemVariants}
          >
            <label htmlFor="email">
              <FaEnvelope className={styles.inputIcon} />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
              required
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </motion.div>

          <motion.div 
            className={styles.inputGroup}
            variants={itemVariants}
          >
            <label htmlFor="phone">
              <FaPhone className={styles.inputIcon} />
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? styles.errorInput : ''}
              required
            />
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </motion.div>

          <motion.div 
            className={styles.inputGroup}
            variants={itemVariants}
          >
            <label htmlFor="password">
              <FaLock className={styles.inputIcon} />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ''}
              required
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className={styles.spinner}></div>
              ) : (
                'Create Account'
              )}
            </button>
          </motion.div>
        </form>

        <motion.div 
          className={styles.loginLink}
          variants={itemVariants}
        >
          Already have an account? <a href="/login" className={styles.link}>Sign in</a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;