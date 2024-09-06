import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const RoomRoleBasedRoute = ({ children, requiredRole }) => {
    const { roomId } = useParams(); // Access roomId from the URL
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkUserRole = async () => {
            const user = auth.currentUser;

            if (user) {
                const memberRef = doc(db, "rooms", roomId, "members", user.uid);
                const memberSnap = await getDoc(memberRef);

                if (memberSnap.exists()) {
                    const role = memberSnap.data().role;
                    setAuthorized(role === requiredRole || role === "owner"); // Owners have access to all routes
                } else {
                    console.error("No role found for this user in the room!");
                }
            } else {
                setAuthorized(false);
            }

            setLoading(false);
        };

        checkUserRole();
    }, [roomId, requiredRole]);

    if (loading) return <p>Loading...</p>;

    return authorized ? children : <Navigate to="/not-authorized" />;
};

export default RoomRoleBasedRoute;
