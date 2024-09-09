import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/AuthService'; // Import the signUp function
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config'; // Ensure Firebase is imported

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Check if the user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in, redirect to the dashboard
                navigate('/dashboard');
            }
        });

        // Cleanup the listener on unmount
        return () => unsubscribe();
    }, [navigate]);

    const handleSignUp = async () => {
        setLoading(true);
        try {
            await signUp(email, password);
            navigate('/dashboard'); // Redirect to the dashboard after successful sign-up
        } catch (error) {
            setError('Failed to sign up: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button onClick={handleSignUp} disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </div>
    );
}

export default SignUp;
