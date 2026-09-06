import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VoterDashboard from "./pages/VoterDashboard";
import Vote from "./pages/Vote";
import VoteSuccess from "./pages/VoteSuccess";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ElectionManagement from "./pages/ElectionManagement";
import CandidateManagement from "./pages/CandidateManagement";
import Blockchain from "./pages/Blockchain";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Voter-only */}
        <Route
          path="/voter/dashboard"
          element={
            <ProtectedRoute requiredRole="voter">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vote"
          element={
            <ProtectedRoute requiredRole="voter">
              <Vote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vote/success"
          element={
            <ProtectedRoute requiredRole="voter">
              <VoteSuccess />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/election"
          element={
            <ProtectedRoute requiredRole="admin">
              <ElectionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <ProtectedRoute requiredRole="admin">
              <CandidateManagement />
            </ProtectedRoute>
          }
        />

        {/* Blockchain explorer - reachable by both roles, page adapts based on role */}
        <Route
          path="/admin/blockchain"
          element={
            <ProtectedRoute>
              <Blockchain />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
