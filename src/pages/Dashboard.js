import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';

function Dashboard() {
    const [ownedRooms, setOwnedRooms] = useState([]);
    const [adminRooms, setAdminRooms] = useState([]);
    const [memberRooms, setMemberRooms] = useState([]);
    const [publicRooms, setPublicRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roomIdInput, setRoomIdInput] = useState(''); // State for room ID input

    useEffect(() => {
        const fetchRoomsAndRoles = async () => {
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

                        // Check if the room is public
                        if (roomData.public) {
                            publicRoomsList.push(roomData);
                        }

                        // Check user's role in the room
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

                setOwnedRooms(owned);
                setAdminRooms(admin);
                setMemberRooms(member);
                setPublicRooms(publicRoomsList);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch rooms: ' + error.message);
                setLoading(false);
            }
        };

        fetchRoomsAndRoles();
    }, []);

    const handleRequestAccess = async (roomId) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            // Send a notification to the room admins for access request
            const notificationsRef = collection(db, 'rooms', roomId, 'notifications');
            await addDoc(notificationsRef, {
                type: 'access_request',
                userId: user.uid,
                userName: user.email,
                timestamp: new Date(),
            });

            alert('Access request sent!');
        } catch (error) {
            setError('Failed to send access request: ' + error.message);
        }
    };

    // Handle joining a room by entering its ID
    const handleJoinRoomById = async () => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const roomRef = doc(db, 'rooms', roomIdInput);
            const roomSnap = await getDoc(roomRef);

            if (roomSnap.exists()) {
                // Send a notification to the room admins for access request
                const notificationsRef = collection(db, 'rooms', roomIdInput, 'notifications');
                await addDoc(notificationsRef, {
                    type: 'access_request',
                    userId: user.uid,
                    userName: user.email,
                    timestamp: new Date(),
                });

                alert('Access request sent!');
            } else {
                alert('Room not found. Please check the room ID.');
            }
        } catch (error) {
            setError('Failed to join room: ' + error.message);
        }
    };

    if (loading) {
        return <p>Loading rooms...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            {/* Input for joining a room by ID */}
            <div>
                <h2>Join a Room by ID</h2>
                <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    placeholder="Enter room ID"
                />
                <button onClick={handleJoinRoomById}>Join Room</button>
            </div>

            {ownedRooms.length > 0 && (
                <div>
                    <h2>Owned Rooms</h2>
                    <ul>
                        {ownedRooms.map((room) => (
                            <li key={room.id}>
                                <Link to={`/room/${room.id}`}>{room.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {adminRooms.length > 0 && (
                <div>
                    <h2>Admin Rooms</h2>
                    <ul>
                        {adminRooms.map((room) => (
                            <li key={room.id}>
                                <Link to={`/room/${room.id}`}>{room.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {memberRooms.length > 0 && (
                <div>
                    <h2>Member Rooms</h2>
                    <ul>
                        {memberRooms.map((room) => (
                            <li key={room.id}>
                                <Link to={`/room/${room.id}`}>{room.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {publicRooms.length > 0 && (
                <div>
                    <h2>Public Rooms</h2>
                    <ul>
                        {publicRooms.map((room) => (
                            <li key={room.id}>
                                <Link to={`/room/${room.id}`}>{room.name}</Link>
                                <button onClick={() => handleRequestAccess(room.id)}>Request Access</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
