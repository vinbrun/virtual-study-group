import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Adjust the path according to your file structure

function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the Virtual Study Group Platform</h1>
                <p>Connect and collaborate with students worldwide.</p>
            </header>
            <section className="home-actions">
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                <Link to="/signin" className="btn btn-secondary">Sign In</Link>
            </section>
            <section className="home-info">
                <h2>Why Join Us?</h2>
                <p>Engage in productive study sessions, share resources, and enhance your learning experience with peers from your courses and others.</p>
            </section>
            <section className="home-features">
                <h2>Features</h2>
                <ul>
                    <li>Create or join real-time study rooms.</li>
                    <li>Share and access notes and resources easily.</li>
                    <li>Communicate through integrated chat systems.</li>
                    <li>Manage your study schedules and plan sessions.</li>
                </ul>
            </section>
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Virtual Study Group Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
