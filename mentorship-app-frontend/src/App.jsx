import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from './pages/SignUp';
import { AdminUsers, AdminMatches, AdminSessions } from "./pages/AdminPages";
import { AvailabilityMentor, RequestMentor, SessionsMentor } from "./pages/MentorPages";
import { MentorsMentee, RequestMentee, SessionsMentee } from "./pages/MenteePages";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

function App() {
  const userRole = localStorage.getItem("userRole") || "mentee"; // Default to mentee if not set

  return (
    <Routes>
      {/* Redirect root to the right dashboard */}
      <Route path="/" element={<Navigate to={`/${userRole === 'admin' ? 'admin/users' : 'dashboard'}`} />} />

      {/* Common */}
      <Route path="/pages/Login" element={<Login />} />
      <Route path="/pages/Signup" element={<Signup />} />
      <Route path="/pages/Dashboard" element={<Dashboard />} />

      {/* Admin */}
      {userRole === "admin" && (
        <>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/matches" element={<AdminMatches />} />
          <Route path="/admin/sessions" element={<AdminSessions />} />
        </>
      )}

      {/* Mentor */}
      {userRole === "mentor" && (
        <>
          <Route path="/availability" element={<AvailabilityMentor />} />
          <Route path="/requests" element={<RequestMentor />} />
          <Route path="/sessions" element={<SessionsMentor />} />
        </>
      )}

      {/* Mentee */}
      {userRole === "mentee" && (
        <>
          <Route path="/mentors" element={<MentorsMentee />} />
          <Route path="/my-requests" element={<RequestMentee />} />
          <Route path="/my-sessions" element={<SessionsMentee />} />
        </>
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
