import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn } from '../services/AuthService';
import Modal from '../components/Modal';

function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false); // Modal open state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
            navigate('/dashboard');
        } catch (error) {
            setError(`Failed to ${isSignUp ? 'sign up' : 'sign in'}: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div>
            <button onClick={() => setModalOpen(true)}>Log In</button> {/* Button to open modal */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
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
                        {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>
                <p>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </span>
                </p>
            </Modal>
        </div>
    );
}

export default AuthPage;
