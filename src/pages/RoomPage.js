import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

function RoomPage() {
    const { roomId } = useParams(); // Access roomId from the URL
    const [roomData, setRoomData] = useState(null);

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

    return (
        <div>
            <h1>Welcome to Room: {roomData ? roomData.name : "Loading..."}</h1>
            <p>This is the regular room page for members.</p>
            {/* Placeholder for room participation functionalities */}
        </div>
    );
}

export default RoomPage;
