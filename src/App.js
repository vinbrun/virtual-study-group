import React from 'react';
import { app } from './firebase-config'; // Ensure firebase is correctly imported
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SignUp from './auth/SignUp';
import SignIn from './auth/SignIn';
import CreateRoom from './components/rooms/CreateRoom';
import RoomDetail from './components/rooms/RoomDetail';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './auth/ForgotPassword';
import RoomRoleBasedRoute from './components/RoomRoleBasedRoute';
import NotAuthorized from './pages/NotAuthorized';
import RoomAdminPanel from './pages/RoomAdminPanel';
import RoomPage from './pages/RoomPage';





function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
          <Route path="/room/:roomId" element={<RoomDetail />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* New room role-based routes */}
          <Route path="/room/:roomId/admin" element={<RoomRoleBasedRoute requiredRole="admin"><RoomAdminPanel /></RoomRoleBasedRoute>} />
          <Route path="/room/:roomId/page" element={<RoomRoleBasedRoute requiredRole="member"><RoomPage /></RoomRoleBasedRoute>} />

          {/* Not authorized page */}
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
