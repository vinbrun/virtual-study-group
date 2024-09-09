import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import RoomList from '../components/rooms/RoomList'; // Reuse the RoomList component
import './Dashboard.css'; // Assume you'll provide Dashboard.css

function Dashboard() {
    const [ownedRooms, setOwnedRooms] = useState([]);
    const [adminRooms, setAdminRooms] = useState([]);
    const [memberRooms, setMemberRooms] = useState([]);
    const [publicRooms, setPublicRooms] = useState([]);
    const [pinnedFiles, setPinnedFiles] = useState([]);
    const [recentFiles, setRecentFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOption, setSortOption] = useState('lastActivity'); // Default sorting option
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomsAndFiles = async () => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error('User not authenticated');

                const roomsCollection = collection(db, 'rooms');
                const roomSnapshot = await getDocs(roomsCollection);

                const owned = [];
                const admin = [];
                const member = [];
                const publicRoomsList = [];

                await Promise.all(
                    roomSnapshot.docs.map(async (roomDoc) => {
                        const roomId = roomDoc.id;
                        const roomData = { id: roomId, ...roomDoc.data() };

                        if (roomData.public) {
                            publicRoomsList.push(roomData);
                        }

                        const memberRef = doc(db, 'rooms', roomId, 'members', user.uid);
                        const memberSnap = await getDoc(memberRef);

                        if (memberSnap.exists()) {
                            const role = memberSnap.data().role;

                            if (role === 'owner') {
                                owned.push(roomData);
                            } else if (role === 'admin') {
                                admin.push(roomData);
                            } else if (role === 'member') {
                                member.push(roomData);
                            }
                        }
                    })
                );

                // Fetch pinned and recent files
                const pinnedFilesList = await fetchPinnedFiles(user.uid);
                const recentFilesList = await fetchRecentFiles(user.uid);

                setOwnedRooms(owned);
                setAdminRooms(admin);
                setMemberRooms(member);
                setPublicRooms(publicRoomsList);
                setPinnedFiles(pinnedFilesList);
                setRecentFiles(recentFilesList);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch rooms: ' + error.message);
                setLoading(false);
            }
        };

        fetchRoomsAndFiles();
    }, []);

    const fetchPinnedFiles = async (userId) => {
        // Fetch pinned files logic (from Firestore or local state)
        return []; // Return mocked or fetched data
    };

    const fetchRecentFiles = async (userId) => {
        // Fetch recent files logic
        return []; // Return mocked or fetched data
    };

    const handleFavoriteRoom = async (roomId) => {
        // Toggle favorite logic (e.g., update user profile in Firestore)
    };

    const handleMuteRoom = async (roomId) => {
        // Toggle mute logic (e.g., update user preferences in Firestore)
    };

    const handleQuitRoom = async (roomId) => {
        if (window.confirm('Are you sure you want to quit this room?')) {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error('User not authenticated');

                const memberRef = doc(db, 'rooms', roomId, 'members', user.uid);
                await deleteDoc(memberRef);

                // Refresh the room list after quitting
                setMemberRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
            } catch (error) {
                setError('Failed to quit the room: ' + error.message);
            }
        }
    };

    const handleSortRooms = (option) => {
        setSortOption(option);
        // Logic to sort rooms based on the selected option
        // Sorting can be done in the rendering phase by dynamically sorting arrays like ownedRooms, memberRooms, etc.
    };

    if (loading) {
        return <p>Loading rooms...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                {/* Sort Options */}
                <div className="sort-container">
                    <label htmlFor="sort">Sort by: </label>
                    <select id="sort" value={sortOption} onChange={(e) => handleSortRooms(e.target.value)}>
                        <option value="lastActivity">Last Activity</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="mostAccessed">Most Accessed</option>
                        <option value="mostFiles">Rooms with Most Files</option>
                        <option value="mostMessages">Rooms with Most Messages</option>
                    </select>
                </div>
            </header>

            {/* Create/Join Room Buttons */}
            <div className="room-actions">
                <button onClick={() => navigate('/create-room')}>Create Room</button>
                <button onClick={() => navigate('/join-room')}>Join Room</button>
            </div>

            {/* Active Rooms List */}
            <div className="room-list">
                <h2>Your Active Rooms</h2>
                <RoomList
                    rooms={ownedRooms.concat(adminRooms, memberRooms)}
                    onFavorite={handleFavoriteRoom}
                    onMute={handleMuteRoom}
                    onQuit={handleQuitRoom}
                />
            </div>

            {/* Pinned/Recent Files/Notes */}
            <div className="files-section">
                <h2>Pinned/Recent Files</h2>
                <div>
                    <h3>Pinned Files</h3>
                    <ul>
                        {pinnedFiles.map((file) => (
                            <li key={file.id}>{file.name}</li>
                        ))}
                    </ul>

                    <h3>Recent Files</h3>
                    <ul>
                        {recentFiles.map((file) => (
                            <li key={file.id}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
