import React, { useState } from 'react';
import { createRoom } from '../../services/RoomService'; // Import the createRoom function
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const roomId = await createRoom(roomName); // Call the createRoom function
            alert(`Room "${roomName}" created successfully!`);
            navigate(`/room/${roomId}`); // Redirect to the newly created room's detail page
        } catch (err) {
            setError(`Failed to create room: ${err.message}`);
        }
    };

    return (
        <div>
            <h1>Create a New Room</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleCreateRoom}>
                <div>
                    <label>Room Name:</label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Room</button>
            </form>
        </div>
    );
}

export default CreateRoom;
