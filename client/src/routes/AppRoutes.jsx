import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Jobs from "../pages/jobs/Jobs";
import Internships from "../pages/internships/Internships";
import Events from "../pages/events/Events";
import Notifications from "../pages/Notifications";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import FindAlumni from "../pages/student/FindAlumni";
import FindMentors from "../pages/student/FindMentors";
import StudentProfile from "../pages/student/StudentProfile";
import MentorshipRequests from "../pages/student/MentorshipRequests";
import MyApplications from "../pages/student/MyApplications";
import StudentSettings from "../pages/student/StudentSettings";
import StudentChat from "../pages/student/StudentChat";

// Alumni Pages
import AlumniDashboard from "../pages/alumni/AlumniDashboard";
import AlumniProfile from "../pages/alumni/AlumniProfile";
import PostJob from "../pages/alumni/PostJob";
import MyJobs from "../pages/alumni/MyJobs";
import PostInternship from "../pages/alumni/PostInternship";
import MyInternships from "../pages/alumni/MyInternships";
import Applicants from "../pages/alumni/Applicants";
import AlumniMentorshipRequests from "../pages/alumni/MentorshipRequests";
import MyMentees from "../pages/alumni/MyMentees";
import AlumniChat from "../pages/alumni/AlumniChat";

// Faculty Pages
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import FacultyStudents from "../pages/faculty/Students";
import FacultyAlumni from "../pages/faculty/Alumni";
import AlumniApprovals from "../pages/faculty/AlumniApprovals";
import RecommendMentor from "../pages/faculty/RecommendMentor";
import Announcements from "../pages/faculty/Announcements";
import ManageEvents from "../pages/faculty/ManageEvents";
import FacultyProfile from "../pages/faculty/FacultyProfile";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import VerifyAlumni from "../pages/admin/VerifyAlumni";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageStudents from "../pages/admin/ManageStudents";
import ManageAlumni from "../pages/admin/ManageAlumni";
import ManageFaculty from "../pages/admin/ManageFaculty";
import ManageJobs from "../pages/admin/ManageJobs";
import ManageInternships from "../pages/admin/ManageInternships";
import ManageEventsAdmin from "../pages/admin/ManageEvents";
import ManageMentorships from "../pages/admin/ManageMentorships";
import ManageApplications from "../pages/admin/ManageApplications";
import PlatformStatistics from "../pages/admin/PlatformStatistics";

// Route Guards
import RoleRoute from "./RoleRoute";
import { ROLES } from "../constants/roles";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/events" element={<Events />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Student Routes */}
        <Route element={<RoleRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/alumni" element={<FindAlumni />} />
          <Route path="/student/find-mentors" element={<FindMentors />} />
          <Route path="/student/chat" element={<StudentChat />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/mentorship-requests" element={<MentorshipRequests />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/student/settings" element={<StudentSettings />} />
        </Route>

        {/* Alumni Routes */}
        <Route element={<RoleRoute allowedRoles={[ROLES.ALUMNI, ROLES.ADMIN]} />}>
          <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
          <Route path="/alumni/profile" element={<AlumniProfile />} />
          <Route path="/alumni/chat" element={<AlumniChat />} />
          <Route path="/alumni/post-job" element={<PostJob />} />
          <Route path="/alumni/jobs" element={<MyJobs />} />
          <Route path="/alumni/post-internship" element={<PostInternship />} />
          <Route path="/alumni/internships" element={<MyInternships />} />
          <Route path="/alumni/applicants" element={<Applicants />} />
          <Route path="/alumni/mentorship-requests" element={<AlumniMentorshipRequests />} />
          <Route path="/alumni/mentees" element={<MyMentees />} />
        </Route>

        {/* Faculty Routes */}
        <Route element={<RoleRoute allowedRoles={[ROLES.FACULTY, ROLES.ADMIN]} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/alumni-approvals" element={<AlumniApprovals />} />
          <Route path="/faculty/students" element={<FacultyStudents />} />
          <Route path="/faculty/alumni" element={<FacultyAlumni />} />
          <Route path="/faculty/recommend-mentor" element={<RecommendMentor />} />
          <Route path="/faculty/announcements" element={<Announcements />} />
          <Route path="/faculty/manage-events" element={<ManageEvents />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verify-alumni" element={<VerifyAlumni />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/alumni" element={<ManageAlumni />} />
          <Route path="/admin/faculty" element={<ManageFaculty />} />
          <Route path="/admin/jobs" element={<ManageJobs />} />
          <Route path="/admin/internships" element={<ManageInternships />} />
          <Route path="/admin/events" element={<ManageEventsAdmin />} />
          <Route path="/admin/mentorships" element={<ManageMentorships />} />
          <Route path="/admin/applications" element={<ManageApplications />} />
          <Route path="/admin/statistics" element={<PlatformStatistics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
