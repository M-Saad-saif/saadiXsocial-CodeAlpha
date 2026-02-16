import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import logo from "../Images/saadIXsocailicon.png";

const Home = () => {
  const features = [
    {
      icon: "🚀",
      title: "Share Moments",
      description:
        "Create posts with images and descriptions. Connect with friends through your stories.",
    },
    {
      icon: "❤️",
      title: "Engage & Interact",
      description:
        "Like posts, follow friends, and build and save your community with real-time updates.",
    },
    {
      icon: "👤",
      title: "Expressive Profiles",
      description:
        "Customize with cover images, profile pictures, and your unique bio.",
    },
    {
      icon: "🛡️",
      title: "Private & Secure",
      description:
        "Your data is protected with JWT authentication. Only you control your content.",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      description:
        "A seamless experience on desktop, tablet, and mobile. Stay connected anywhere.",
    },
    {
      icon: "⚡",
      title: "Real-Time Feed",
      description:
        "See posts from people you follow with infinite scroll and instant updates.",
    },
  ];

  return (
    <div className="landing-container">
      <div className="landing-background"></div>

      <div className="landing-hero">
        <div className="hero-content">
          <div>
            <h1 className="hero-title">
              <img
                src={logo}
                alt=""
                style={{ width: "50px", position: "relative", top: "10px" }}
              />
              <span className="hero-gradient">saadIXsocials</span>
            </h1>
          </div>
          <p className="hero-subtitle">
            Connect with family and friends. Share your world, securely.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary btn-large">
              Create account <span className="btn-arrow">→</span>
            </Link>
            <Link to="/login" className="btn-secondary btn-large">
              Log in
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">12+</span>
              <span className="stat-label">Features</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Your Data</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Connection</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="visual-header">
              <span className="visual-avatar"></span>
              <span className="visual-name">Saad</span>
            </div>
            <div className="visual-image"></div>
            <div className="visual-actions">
              <span className="visual-like">❤️</span>
            </div>
          </div>
          <div className="visual-card card-2">
            <div className="visual-header">
              <span className="visual-avatar"></span>
              <span className="visual-name">Rock</span>
            </div>
            <div className="visual-image"></div>
            <div className="visual-actions">
              <span className="visual-like">❤️</span>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">
          Everything you need in a{" "}
          <span className="gradient-text">social space</span>
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-large">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Ready to connect?</h2>
          <p className="cta-text">
            Join saadIXsocials today and start sharing your journey.
          </p>
          <Link to="/register" className="btn-primary btn-large">
            Create your free account
          </Link>
          <p className="cta-login">
            Already have an account?{" "}
            <Link to="/login" className="cta-link">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Simple footer */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} saadIXsocials. Built with MERN.</p>
        <div className="home-footer-links">
          <Link to="https://github.com/M-Saad-saif">
            <i className="ri-github-fill"></i>GitHub
          </Link>
          <Link to="https://www.linkedin.com/in/muhammad-saad-saif-10b38a360/">
            <i className="ri-linkedin-box-fill"></i>Linkdin
          </Link>
          <Link to="mailto:gcsaadsaif123@gmail.com">
            <i className="ri-mail-fill"></i>Email
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
