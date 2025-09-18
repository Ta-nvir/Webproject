import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaSignInAlt, FaUser } from 'react-icons/fa';
import styles from './assets/UserLogin.module.css';

function UserLogin({ updaterole }) {
  const [formData, setFormData] = useState({ emailid: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const dataHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/userLogin", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
        updaterole(result.role);
        navigate('/maidProfile');
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation Variants
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

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    },
    static: { x: 0 }
  };

  return (
    <div className={`container-fluid ${styles.bgGradient}`}>
      <motion.div
        className={styles.loginContainer}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className={styles.decorCircle1}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className={styles.decorCircle2}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className={`${styles.loginForm} ${shake ? styles.shake : ''}`}
          variants={shakeVariants}
          animate={shake ? "shake" : "static"}
        >
          <motion.div className={styles.logoContainer} variants={itemVariants}>
            <FaUser className={styles.logoIcon} />
            <h3>User Login</h3>
          </motion.div>

          <motion.form onSubmit={submitHandler} variants={containerVariants}>
            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label htmlFor="emailid">
                <FaEnvelope className={styles.inputIcon} />
                Email
              </label>
              <input
                type="email"
                name="emailid"
                value={formData.emailid}
                onChange={dataHandler}
                placeholder="Email ID"
                required
                className={styles.inputField}
              />
              <div className={styles.inputUnderline}></div>
            </motion.div>

            <motion.div className={styles.inputGroup} variants={itemVariants}>
              <label htmlFor="password">
                <FaLock className={styles.inputIcon} />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={dataHandler}
                placeholder="••••••••"
                required
                className={styles.inputField}
              />
              <div className={styles.inputUnderline}></div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <>
                    <FaSignInAlt className={styles.buttonIcon} />
                    Login
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          <motion.div className={styles.footerLinks} variants={itemVariants}>
            <Link to="/forgot-password" className={styles.link}>Forgot password?</Link>
            <span className={styles.linkDivider}>|</span>
            <Link to="/contact-support" className={styles.link}>Contact Support</Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UserLogin;
