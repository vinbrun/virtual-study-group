import React, { useState, useEffect } from 'react';
import { updateProfile, updateEmail, updatePassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config'; // Import the centralized auth object

function Profile() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(''); // New state to store debug messages

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setName(currentUser.displayName || '');
                setEmail(currentUser.email || '');
                setMessage(`User detected: ${currentUser.email}`); // Set message when user is detected
            } else {
                setMessage("No user detected, staying on this page for debugging."); // Set message when no user is detected
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (name !== user.displayName) {
                await updateProfile(user, { displayName: name });
            }
            if (email !== user.email) {
                await updateEmail(user, email);
            }
            if (password) {
                await updatePassword(user, password);
            }
            alert('Profile updated successfully!');
        } catch (error) {
            setError('Failed to update profile: ' + error.message);
        }
        setLoading(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Manage Your Profile</h1>
            {message && <p>{message}</p>} {/* Display debug message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>New Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            ) : (
                <p>Please sign in to access your profile.</p>
            )}
        </div>
    );
}

export default Profile;
