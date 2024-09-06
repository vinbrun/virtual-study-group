import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../firebase-config';

function RoomList() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('rooms').where('active', '==', true)
            .onSnapshot(snapshot => {
                const fetchedRooms = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRooms(fetchedRooms);
            });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h2>Available Study Rooms</h2>
            <ul>
                {rooms.map(room => (
                    <li key={room.id}>
                        <Link to={`/room/${room.id}`}>{room.name}</Link> - {room.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoomList;
