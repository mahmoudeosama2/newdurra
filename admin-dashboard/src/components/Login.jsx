import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, AlertCircle } from 'lucide-react';

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // استخدام الـ full URL بدلاً من relative path
      const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        // حفظ الـ token في localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.token, response.data.user);
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure the backend is running on port 3001.');
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hamed Awadh Group Management System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center text-xs text-gray-500">
          <p>Default credentials: admin / admin123</p>
          <p className="mt-1">Please change the password after first login</p>
          <p className="mt-2 text-gray-400">API: {API_BASE_URL}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;