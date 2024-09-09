import React from 'react';
import { app } from './firebase-config'; // Ensure firebase is correctly imported
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateRoom from './components/rooms/CreateRoom';
import RoomDetail from './components/rooms/RoomDetail';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './auth/ForgotPassword';
import RoomRoleBasedRoute from './components/RoomRoleBasedRoute';
import NotAuthorized from './pages/NotAuthorized';
import RoomAdminPanel from './pages/RoomAdminPanel';
import RoomPage from './pages/RoomPage';
import Header from './components/Header';  // Import Header
import AuthPage from './pages/AuthPage'; // Import the new AuthPage






function App() {
  return (
    <Router>
      <Header />  {/* Include Header on every page */}
      <div>
        <Routes>
          <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
          <Route path="/room/:roomId" element={<PrivateRoute><RoomDetail /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/room/:roomId/admin" element={<RoomRoleBasedRoute requiredRole="admin"><RoomAdminPanel /></RoomRoleBasedRoute>} />
          <Route path="/room/:roomId/page" element={<RoomRoleBasedRoute requiredRole="member"><RoomPage /></RoomRoleBasedRoute>} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;