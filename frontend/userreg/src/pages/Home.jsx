import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to User Registration Project</h1>
          <p>
            Our project aims to revolutionize how users interact with technology. Explore our features, and let us help you achieve your goals.
          </p>
          <div className="action-buttons">
            <a href="/signup" className="btn btn-primary">Get Started</a>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;