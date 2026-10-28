import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Hash, BookOpen, Building2, Phone, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { registerUser, setAuthToken, setStoredStudent } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roll_number: '',
    course: '',
    department: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic client validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.roll_number.trim() || !formData.course.trim() || !formData.department.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);
      setSuccess('Account created successfully! Redirecting to dashboard...');

      // Store auth session immediately
      if (response.token && response.student) {
        setAuthToken(response.token);
        setStoredStudent(response.student);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-badge">Student Portal</div>
          <h2>Create Your Account</h2>
          <p>Register with your university credentials to access the student dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Roll Number / Student ID */}
            <div className="form-group">
              <label htmlFor="roll_number">Roll / Student ID Number *</label>
              <div className="input-wrapper">
                <Hash className="input-icon" size={18} />
                <input
                  id="roll_number"
                  type="text"
                  name="roll_number"
                  placeholder="e.g. CS2024-042"
                  value={formData.roll_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Course / Program */}
            <div className="form-group">
              <label htmlFor="course">Course / Degree *</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" size={18} />
                <input
                  id="course"
                  type="text"
                  name="course"
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <div className="input-wrapper">
                <Building2 className="input-icon" size={18} />
                <input
                  id="department"
                  type="text"
                  name="department"
                  placeholder="e.g. School of Engineering"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group full-width">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Register Student Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
