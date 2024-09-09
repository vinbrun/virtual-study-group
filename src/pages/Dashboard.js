// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import RoomList from '../components/rooms/RoomList'; // Reuse the RoomList component

function Dashboard() {
    const [ownedRooms, setOwnedRooms] = useState([]);
    const [adminRooms, setAdminRooms] = useState([]);
    const [memberRooms, setMemberRooms] = useState([]);
    const [publicRooms, setPublicRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) {
        return <p>Loading rooms...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {/* Reuse RoomList Component */}
            {ownedRooms.length > 0 && <RoomList rooms={ownedRooms} isPublic={false} />}
            {adminRooms.length > 0 && <RoomList rooms={adminRooms} isPublic={false} />}
            {memberRooms.length > 0 && <RoomList rooms={memberRooms} isPublic={false} />}
            {publicRooms.length > 0 && (
                <RoomList rooms={publicRooms} isPublic={true} handleRequestAccess={handleRequestAccess} />
            )}
        </div>
    );
}

export default Dashboard;
