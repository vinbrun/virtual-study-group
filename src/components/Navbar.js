import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase-config'; // Import the auth object


function Navbar() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user && <li><Link to="/profile">Profile</Link></li>}
        {user ? (
          <li><button onClick={() => auth.signOut()}>Sign Out</button></li>
        ) : (
          <>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
