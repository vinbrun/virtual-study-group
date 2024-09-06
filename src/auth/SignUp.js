import React, { useState } from 'react';
import { signUp } from '../services/AuthService'; // Import the signUp function

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        try {
            await signUp(email, password);
            alert('Signup successful!');
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
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleSignUp} disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </div>
    );
}

export default SignUp;
