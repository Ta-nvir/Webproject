import React, { useEffect } from "react";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import { FaWrench, FaUserCheck, FaBolt, FaWater, FaTools, FaPhone, FaHome } from "react-icons/fa";
import gsap from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import bgimg from './assets/Images/car1.jpeg'

const HomePage = () => {
  useEffect(() => {
    gsap.from(".hero-text", { opacity: 0, y: -50, duration: 1 });
    gsap.from(".feature-card", {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
      delay: 0.5,
    });
    gsap.from(".how-step", {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.3,
      delay: 0.8,
    });
    gsap.from(".cta-section", {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      delay: 1,
    });
  }, []);

  return (
    <div className="homepage bg-light min-vh-100">
 

      <div className="hero-section text-white d-flex align-items-center justify-content-center" style={{
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgimg}) center/cover no-repeat`,
        height: "100vh"
      }}>
        <div className="text-center hero-text">
          <h1 className="display-3 fw-bold">Easy Mech</h1>
          <p className="lead mb-4">Your Trusted Partner for Home Services in the City</p>
          <Button variant="warning" size="lg">Book a Worker Now</Button>
        </div>
      </div>

      <Container className="text-center py-5">
        <h2 className="fw-bold mb-4 text-primary">What We Offer</h2>
        <Row className="g-4">
          <Col md={3} sm={6}>
            <div className="feature-card p-4 shadow bg-white rounded-4 h-100">
              <FaUserCheck size={40} className="mb-3 text-success" />
              <h5>Easy Registration</h5>
              <p className="text-muted">Sign up and login in seconds.</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="feature-card p-4 shadow bg-white rounded-4 h-100">
              <FaWrench size={40} className="mb-3 text-info" />
              <h5>Trusted Technicians</h5>
              <p className="text-muted">Verified local plumbers & electricians.</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="feature-card p-4 shadow bg-white rounded-4 h-100">
              <FaBolt size={40} className="mb-3 text-danger" />
              <h5>Instant Booking</h5>
              <p className="text-muted">Book and track service status easily.</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="feature-card p-4 shadow bg-white rounded-4 h-100">
              <FaTools size={40} className="mb-3 text-warning" />
              <h5>Reliable Support</h5>
              <p className="text-muted">Prompt customer support & quality service.</p>
            </div>
          </Col>
        </Row>

        <section className="mt-5">
          <h2 className="fw-bold text-primary mb-4">How It Works</h2>
          <Row className="text-center">
            <Col md={4} className="how-step">
              <div className="p-4 bg-white rounded-4 shadow h-100">
                <h5 className="mb-3">1. Register/Login</h5>
                <p className="text-muted">Quick and secure account setup.</p>
              </div>
            </Col>
            <Col md={4} className="how-step">
              <div className="p-4 bg-white rounded-4 shadow h-100">
                <h5 className="mb-3">2. Find a Worker</h5>
                <p className="text-muted">Browse verified local service professionals.</p>
              </div>
            </Col>
            <Col md={4} className="how-step">
              <div className="p-4 bg-white rounded-4 shadow h-100">
                <h5 className="mb-3">3. Book & Relax</h5>
                <p className="text-muted">Confirm your booking and sit back.</p>
              </div>
            </Col>
          </Row>
        </section>

        <div className="cta-section mt-5 p-5 bg-warning rounded-4 shadow text-dark">
          <h3 className="fw-bold">Need Help at Home?</h3>
          <p className="mb-4">Let Easy Mech handle it for you—quick, easy, and safe.</p>
          <Button variant="dark" size="lg">Get Started</Button>
        </div>
      </Container>

      <footer className="bg-dark text-white text-center py-4 mt-5">
        <Container>
          <p className="mb-0">&copy; {new Date().getFullYear()} Easy Mech. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-white me-3">Privacy</a>
            <a href="#" className="text-white">Contact <FaPhone /></a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;