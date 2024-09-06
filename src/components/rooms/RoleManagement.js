import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import { assignRole } from '../../services/RoomService';

function RoleManagement() {
    const { roomId } = useParams();
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Subscribe to real-time updates of the members subcollection
        const membersRef = collection(db, "rooms", roomId, "members");
        const unsubscribe = onSnapshot(membersRef, (snapshot) => {
            const membersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMembers(membersList);
        }, (err) => setError(err.message));

        return () => unsubscribe();
    }, [roomId]);

    const handleRoleChange = async (memberId, newRole) => {
        try {
            await assignRole(roomId, memberId, newRole);
            alert(`Role updated to ${newRole}`);
        } catch (error) {
            setError('Failed to update role: ' + error.message);
        }
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Manage Roles</h2>
            <ul>
                {members.map((member) => (
                    <li key={member.id}>
                        {member.email} - Current Role: {member.role}
                        <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoleManagement;
