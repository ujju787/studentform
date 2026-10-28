import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Hash,
  BookOpen,
  Building2,
  Phone,
  Calendar,
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  User,
} from 'lucide-react';
import { getStudentProfile, clearAuth, setStoredStudent } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    setError('');

    try {
      const response = await getStudentProfile();
      if (response.success && response.data) {
        setStudent(response.data);
        setStoredStudent(response.data);
      } else {
        throw new Error(response.message || 'Failed to load student profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Unable to retrieve your student details from database.');
      if (err.status === 401) {
        clearAuth();
        navigate('/login');
      }
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Fetching your verified student details from database...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Top greeting banner */}
        <div className="dashboard-header-bar">
          <div>
            <h1>Student Portal Dashboard</h1>
            <p>Welcome back, <strong>{student?.name || 'Student'}</strong>! Here are your registered academic details.</p>
          </div>
          <div className="dashboard-actions">
            <button
              onClick={() => fetchProfile(true)}
              className="btn-secondary"
              disabled={refreshing}
              title="Refresh database records"
            >
              <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
              <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
            <button onClick={handleLogout} className="btn-logout-dash">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {student && (
          <div className="dashboard-grid">
            {/* Primary Profile Card */}
            <div className="profile-hero-card">
              <div className="profile-avatar-circle">
                {getInitials(student.name)}
              </div>
              <div className="profile-hero-info">
                <div className="badge-verified">
                  <ShieldCheck size={14} />
                  <span>Verified Database Record</span>
                </div>
                <h2>{student.name}</h2>
                <p className="student-email">{student.email}</p>
                <div className="roll-chip">
                  <Hash size={14} />
                  <span>Roll No: {student.roll_number}</span>
                </div>
              </div>
            </div>

            {/* Academic Details Card */}
            <div className="details-card">
              <div className="card-header">
                <GraduationCap size={20} className="card-icon" />
                <h3>Academic Information</h3>
              </div>
              <div className="detail-rows">
                <div className="detail-item">
                  <span className="detail-label">Enrolled Course</span>
                  <div className="detail-value">
                    <BookOpen size={16} />
                    <span>{student.course}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Department / Faculty</span>
                  <div className="detail-value">
                    <Building2 size={16} />
                    <span>{student.department}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Academic Status</span>
                  <div className="detail-value status-active">
                    <CheckCircle size={16} />
                    <span>Active Student</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Registration Metadata Card */}
            <div className="details-card">
              <div className="card-header">
                <User size={20} className="card-icon" />
                <h3>Contact & Account Information</h3>
              </div>
              <div className="detail-rows">
                <div className="detail-item">
                  <span className="detail-label">Registered Email</span>
                  <div className="detail-value">
                    <Mail size={16} />
                    <span>{student.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Phone Contact</span>
                  <div className="detail-value">
                    <Phone size={16} />
                    <span>{student.phone || 'Not provided'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Registered On</span>
                  <div className="detail-value">
                    <Calendar size={16} />
                    <span>{formatDate(student.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
