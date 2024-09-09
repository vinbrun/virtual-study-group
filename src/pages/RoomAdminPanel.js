import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function RoomAdminPanel() {
    const { roomId } = useParams(); // Access roomId from the URL
    const [roomData, setRoomData] = useState(null);
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
        const fetchRoomData = async () => {
            const roomRef = doc(db, "rooms", roomId);
            const roomSnap = await getDoc(roomRef);
            if (roomSnap.exists()) {
                setRoomData(roomSnap.data());
            }
        };

        fetchRoomData();
    }, [roomId]);

    const handleUpdateRoom = async () => {
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
            name: newRoomName || roomData.name,
        });
        alert("Room updated successfully!");
    };

    return (
        <div>
            <h1>Admin Panel for Room: {roomData ? roomData.name : "Loading..."}</h1>
            <div>
                <label>Change Room Name:</label>
                <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder={roomData ? roomData.name : "Loading..."}
                />
                <button onClick={handleUpdateRoom}>Update Room</button>
            </div>
            {/* Placeholder for other admin functionalities */}
        </div>
    );
}

export default RoomAdminPanel;
