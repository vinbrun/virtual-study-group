import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, updateDoc, deleteDoc, collection, getDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from '../firebase-config';


export const createRoom = async (roomName) => {
    try {
        console.log("Firestore DB instance:", db);  // Log Firestore instance
        console.log("Collection function:", collection);  // Log collection function

        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const roomRef = doc(collection(db, "rooms"));  // Log Firestore instance and collection function
        await setDoc(roomRef, {
            name: roomName,
            createdBy: user.uid,
            createdAt: new Date(),
        });

        const memberRef = doc(collection(db, "rooms", roomRef.id, "members"), user.uid);
        await setDoc(memberRef, {
            role: "owner",
            email: user.email,
        });

        return roomRef.id;
    } catch (error) {
        console.error("Error creating room:", error);  // Log the error
        throw error;
    }
};


// Join a room as a member
export const joinRoom = async (roomId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Use modular syntax to reference the members subcollection
        const memberRef = doc(collection(db, "rooms", roomId, "members"), user.uid);
        await setDoc(memberRef, {
            role: "member", // Default role when joining
            email: user.email,
        });
    } catch (error) {
        throw error;
    }
};

// Assign a new role to a user in the room (only by owner or admin)
export const assignRole = async (roomId, userId, newRole) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User not authenticated");

        // Check if the current user is an owner or admin
        const currentUserRef = doc(db, "rooms", roomId, "members", currentUser.uid);
        const currentUserSnap = await getDoc(currentUserRef);

        if (!currentUserSnap.exists()) {
            throw new Error("User does not have permission to assign roles");
        }

        const currentUserRole = currentUserSnap.data().role;
        if (currentUserRole !== "owner" && currentUserRole !== "admin") {
            throw new Error("Only owners and admins can assign roles");
        }

        // Assign the new role to the specified user
        const memberRef = doc(db, "rooms", roomId, "members", userId);
        await updateDoc(memberRef, {
            role: newRole,
        });
    } catch (error) {
        throw error;
    }
};

// Delete a room (only by the owner)
export const deleteRoom = async (roomId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Check if the user is the owner
        const memberRef = doc(collection(db, "rooms", roomId, "members"), user.uid);
        const memberSnap = await getDoc(memberRef);

        if (memberSnap.exists() && memberSnap.data().role === "owner") {
            // Delete the room if the user is the owner
            await deleteDoc(doc(db, "rooms", roomId));
        } else {
            throw new Error("Only the owner can delete the room");
        }
    } catch (error) {
        throw error;
    }
};

// Leave a room
export const leaveRoom = async (roomId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Use modular syntax to reference the members subcollection
        const memberRef = doc(collection(db, "rooms", roomId, "members"), user.uid);
        await deleteDoc(memberRef);
    } catch (error) {
        throw error;
    }
};

// Send a message in a room
export const sendMessage = async (roomId, messageContent) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const messageRef = collection(db, "rooms", roomId, "messages");
        await addDoc(messageRef, {
            content: messageContent,
            senderId: user.uid,
            senderName: user.email, // You can also store the user's display name if available
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        throw error;
    }
};

// Get messages in real-time for a room
export const getMessages = (roomId, callback, errorCallback) => {
    try {
        const messagesRef = collection(db, "rooms", roomId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        // Listen for real-time updates to the messages subcollection
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messages);
        }, errorCallback);
    } catch (error) {
        errorCallback(error);
    }
};


// Upload a file to Firebase Storage and store metadata in Firestore
export const uploadFile = async (roomId, file) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, `rooms/${roomId}/files/${file.name}`);
        
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL of the uploaded file
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // Store file metadata in Firestore
        const fileRef = collection(db, "rooms", roomId, "files");
        await addDoc(fileRef, {
            fileName: file.name,
            fileUrl: downloadUrl,
            uploaderId: user.uid,
            uploaderName: user.email,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        throw error;
    }
};

// Get files in real-time for a room
export const getFiles = (roomId, callback, errorCallback) => {
    try {
        const filesRef = collection(db, "rooms", roomId, "files");
        const q = query(filesRef, orderBy("timestamp", "asc"));

        // Listen for real-time updates to the files subcollection
        return onSnapshot(q, (snapshot) => {
            const files = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(files);
        }, errorCallback);
    } catch (error) {
        errorCallback(error);
    }
};

// Delete a file from Firebase Storage and remove its metadata from Firestore
export const deleteFile = async (roomId, fileId, fileName) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Delete the file from Firebase Storage
        const storageRef = ref(storage, `rooms/${roomId}/files/${fileName}`);
        await deleteObject(storageRef);

        // Delete the file metadata from Firestore
        const fileRef = doc(db, "rooms", roomId, "files", fileId);
        await deleteDoc(fileRef);
    } catch (error) {
        throw error;
    }
};
