import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { signIn } from '../services/AuthService'; // Import the signIn function

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/dashboard'); // Redirect to dashboard after successful sign-in
        } catch (error) {
            setError('Failed to sign in: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Sign In</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignIn}> {/* Form element to handle Enter key submission */}
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}

export default SignIn;
