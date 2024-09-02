import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

function Notifications({ roomId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                console.log("Fetching notifications for room:", roomId);
                const notificationsRef = collection(db, 'rooms', roomId, 'notifications');
                const notificationsSnapshot = await getDocs(notificationsRef);

                if (!notificationsSnapshot.empty) {
                    const notificationsList = notificationsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setNotifications(notificationsList);
                    console.log("Fetched notifications:", notificationsList);
                } else {
                    console.log("No notifications found");
                    setNotifications([]);
                }

                setLoading(false);
            } catch (error) {
                setError('Failed to fetch notifications: ' + error.message);
                console.error("Error fetching notifications:", error);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [roomId]);

    const handleApprove = async (notificationId, userId) => {
    	try {
     	   // Add the user to the members subcollection with the 'member' role
     	   const memberRef = doc(db, 'rooms', roomId, 'members', userId);
     	   await setDoc(memberRef, {
     	       role: 'member',
     	       addedAt: new Date(),
     	   });

      	  // Remove the notification after approval
      	  const notificationRef = doc(db, 'rooms', roomId, 'notifications', notificationId);
   	     await deleteDoc(notificationRef);

    	    // Remove the notification from the state
     	   setNotifications(notifications.filter(notif => notif.id !== notificationId));
     	   console.log("Approved request for user:", userId);
  	  } catch (error) {
  	      setError('Failed to approve request: ' + error.message);
  	      console.error("Error approving request:", error);
  	  }
	};

    const handleDeny = async (notificationId) => {
        try {
            // Remove the notification after denial
            const notificationRef = doc(db, 'rooms', roomId, 'notifications', notificationId);
            await deleteDoc(notificationRef);

            // Remove the notification from the state
            setNotifications(notifications.filter(notif => notif.id !== notificationId));
            console.log("Denied request with notification ID:", notificationId);
        } catch (error) {
            setError('Failed to deny request: ' + error.message);
            console.error("Error denying request:", error);
        }
    };

    if (loading) {
        return <p>Loading notifications...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (notifications.length === 0) {
        return <p>No notifications available</p>;
    }

    return (
        <div>
            <h3>Access Requests</h3>
            <ul>
                {notifications.map((notif) => (
                    <li key={notif.id}>
                        <p>{notif.userName} has requested access to this room.</p>
                        <button onClick={() => handleApprove(notif.id, notif.userId)}>Approve</button>
                        <button onClick={() => handleDeny(notif.id)}>Deny</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications;
