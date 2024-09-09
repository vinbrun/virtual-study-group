import React, { useState, useEffect } from 'react';
import RoomList from '../components/rooms/RoomList'; // Reuse the RoomList component
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import './Home.css'; // CSS for styling the Home page

function Home() {
    const [publicRooms, setPublicRooms] = useState([]);

    useEffect(() => {
        const fetchPublicRooms = async () => {
            try {
                const roomsCollection = collection(db, 'rooms');
                const roomSnapshot = await getDocs(roomsCollection);
                const publicRoomsList = roomSnapshot.docs
                    .map((roomDoc) => ({ id: roomDoc.id, ...roomDoc.data() }))
                    .filter((roomData) => roomData.public);

                setPublicRooms(publicRoomsList);
            } catch (error) {
                console.error('Failed to fetch public rooms:', error);
            }
        };

        fetchPublicRooms();
    }, []);

    return (
        <div className="home-container">
            {/* Two-column layout for welcome and public rooms */}
            <div className="main-layout">
                {/* Small Welcome Section on the Left */}
                <section className="small-hero-section">
                    <h1>Welcome to Shared Notes</h1>
                    <p>Collaborate, share, and learn together!</p>
                    <button className="cta-button">Get Started</button>
                </section>

                {/* Public Rooms Section on the Right */}
                <section className="public-rooms-section">
                    <h2>Public Rooms</h2>
                    {publicRooms.length > 0 ? (
                        <RoomList rooms={publicRooms} isPublic={true} />
                    ) : (
                        <p>No public rooms available at the moment.</p>
                    )}
                </section>
            </div>

            {/* Features Section (Optional) */}
            <section className="features-section">
                <h2>Why Choose Shared Notes?</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>Create Study Rooms</h3>
                        <p>Create private or public rooms to study with peers.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Share Notes</h3>
                        <p>Share and access resources easily with your study group.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Collaborate in Real Time</h3>
                        <p>Work together through integrated tools like chat and notes.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Shared Notes. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/terms">Terms of Service</a>
                    <a href="/privacy">Privacy Policy</a>
                </div>
            </footer>
        </div>
    );
}

export default Home;