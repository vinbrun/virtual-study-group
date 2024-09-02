import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config'; // Import the centralized auth object

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a spinner or loading component
  }

  return user ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
