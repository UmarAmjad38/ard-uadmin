import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Main Pages
import Dashboard from './pages/Dashboard';
import PropertiesList from './pages/properties/PropertiesList';
import BlogsList from './pages/blogs/BlogsList';
import CategoriesList from './pages/categories/CategoriesList';
import TeamList from './pages/team/TeamList';
import ContactsList from './pages/contacts/ContactsList';
import ProfileSettings from './pages/settings/ProfileSettings';
import HeroList from './pages/heroes/HeroList';
import QnaList from './pages/qna/QnaList';
import StatsList from './pages/stats/StatsList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="properties" element={<PropertiesList />} />
            <Route path="blogs" element={<BlogsList />} />
            <Route path="categories" element={<CategoriesList />} />
            {/* <Route path="team" element={<TeamList />} /> */}
            <Route path="contacts" element={<ContactsList />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="hero-sections" element={<HeroList />} />
            <Route path="qnas" element={<QnaList />} />
            <Route path="stats" element={<StatsList />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
