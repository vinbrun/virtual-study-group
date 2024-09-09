// src/components/RoomList.js
import React from 'react';
import { Link } from 'react-router-dom';

function RoomList({ rooms, isPublic, handleRequestAccess }) {
    return (
        <div>
            <h2>{isPublic ? 'Public Rooms' : 'Available Rooms'}</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room.id}>
                        <Link to={`/room/${room.id}`}>{room.name}</Link>
                        {isPublic && <button onClick={() => handleRequestAccess(room.id)}>Request Access</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoomList;
