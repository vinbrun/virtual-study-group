import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (error) {
            setError('Failed to send reset email: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Reset Password</h1>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
        </div>
    );
}

export default ForgotPassword;
