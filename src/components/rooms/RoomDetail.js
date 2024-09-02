import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { joinRoom, leaveRoom } from '../../services/RoomService';
import RoleManagement from './RoleManagement';
import Chat from './Chat'; 
import FileSharing from './FileSharing'; 
import Notifications from './Notifications';

function RoomDetail() {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // To redirect after leaving the room

    useEffect(() => {
        const fetchRoomAndRole = async () => {
            try {
                console.log("Fetching room data...");
                
                // Fetch room data
                const roomRef = doc(db, 'rooms', roomId);
                const roomSnap = await getDoc(roomRef);
                
                if (roomSnap.exists()) {
                    setRoom({ id: roomSnap.id, ...roomSnap.data() });
                    console.log("Room data:", roomSnap.data());
                } else {
                    throw new Error('Room not found');
                }

                // Fetch user role in the room
                if (auth.currentUser) {
                    console.log("Fetching user role...");
                    const memberRef = doc(db, 'rooms', roomId, 'members', auth.currentUser.uid);
                    const memberSnap = await getDoc(memberRef);
                    
                    if (memberSnap.exists()) {
                        setCurrentUserRole(memberSnap.data().role);
                        console.log("User role:", memberSnap.data().role);
                    } else {
                        setCurrentUserRole(null); // Not a member
                        console.log("User is not a member of the room.");
                    }
                }
            } catch (err) {
                console.error("Error fetching room data or user role:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomAndRole();
    }, [roomId]);

    const handleLeaveRoom = async () => {
        try {
            if (!auth.currentUser) throw new Error("User not authenticated");
            await leaveRoom(roomId);
            console.log("User left the room successfully.");
            navigate('/dashboard'); // Redirect the user to the dashboard after leaving the room
        } catch (error) {
            setError('Failed to leave room: ' + error.message);
            console.error("Error leaving the room:", error);
        }
    };

    if (loading) return <div>Loading room details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!room) return <div>Room not found.</div>;

    return (
        <div>
            <h2>{room.name}</h2>
            <p>{room.description}</p>

            {/* Only show Leave Room button if user is in the room */}
            {currentUserRole && <button onClick={handleLeaveRoom}>Leave Room</button>}

            {(currentUserRole === "owner" || currentUserRole === "admin") && (
                <>
                    <RoleManagement />
                    <Notifications roomId={roomId} />
                </>
            )}

            <Chat />
            <FileSharing />
        </div>
    );
}

export default RoomDetail;
