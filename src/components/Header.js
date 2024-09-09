import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase-config'; // Google login only
import Modal from '../components/Modal'; // Import Modal component
import { signIn, signUp } from '../services/AuthService'; // Import AuthService
import './Header.css'; // Your styles for the header
import googleLogo from '../assets/google-logo.png'; // Correct path to the image inside src

function Header() {
    const [user, setUser] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false); // Modal state
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Log In and Register new account
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check if the user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Handle logout
    const handleLogout = async () => {
        await signOut(auth);
    };

    // Handle form submission for Log In/Register new account
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignUp) {
                await signUp(email, password); // Register a new account
            } else {
                await signIn(email, password); // Log in to an existing account
            }
            setModalOpen(false); // Close modal after successful login/signup
        } catch (error) {
            setError(`Failed to ${isSignUp ? 'register' : 'log in'}: ${error.message}`);
        }
        setLoading(false);
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            setModalOpen(false); // Close modal after successful Google login
        } catch (error) {
            setError(`Failed to log in with Google: ${error.message}`);
        }
    };

    // Handle toggle between Sign Up and Log In
    const handleToggle = () => {
        setIsSignUp((prev) => !prev); // Toggle the SignUp state
        setError(''); // Reset any existing errors when toggling forms
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <Link to="/"><img src="/logo.png" alt="App Logo" className="app-logo" /></Link>
            </div>
            <div className="header-center">
                <h1>Shared Notes</h1>
            </div>
            <div className="header-right">
                {user ? (
                    <div className="user-dropdown">
                        <img
                            src={user.photoURL || "/icons8-account-50.png"}
                            alt="User"
                            className="user-icon"
                        />
                        <div className="dropdown-content">
                            <Link to="/profile">Profile</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <button className="plain-text-link" onClick={() => setModalOpen(true)}>
                            Log In
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for Log In/Register new account */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} key={isSignUp ? 'signUp' : 'signIn'}>
                <h1>Time to share!</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    
                    {/* Password Input */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />

                    {/* Log In Button */}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? (isSignUp ? 'Registering...' : 'Logging In...') : (isSignUp ? 'Register new account' : 'Log In')}
                    </button>
                </form>

                {/* Register new account */}
                <p className="toggle-link">
                    <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={handleToggle}  // Entire text is clickable
                    >
                        {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Register new account"}
                    </span>
                </p>

                {/* Forgot your password */}
                {!isSignUp && <p><Link to="/forgot-password" className="forgot-password">Forgot your password?</Link></p>}
                
                {/* Google Login Button */}
                <button onClick={handleGoogleLogin} className="google-login-button">
                    <img src={googleLogo} alt="Google logo" className="google-logo" />
                    Continue with Google
                </button>
            </Modal>
        </header>
    );
}

export default Header;