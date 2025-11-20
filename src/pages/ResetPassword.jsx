import { useState, useEffect } from 'react';
import {NavLink, useNavigate, useSearchParams} from 'react-router-dom';
import LoginService from '../API/login.js';
import Logo from '../assets/icons/logo.svg?react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    loading: false,
    message: '',
    error: '',
    tokenValid: false
  });

  useEffect(() => {
    if (token) {
      const validation = LoginService.validateResetToken(token);
      if (validation.valid) {
        setState(prev => ({ ...prev, tokenValid: true }));
      } else {
        setState(prev => ({ ...prev, error: validation.message }));
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      setState(prev => ({ ...prev, error: 'Passwords do not match' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      await LoginService.resetPassword(token, state.password);
      setState(prev => ({ ...prev, loading: false, message: 'Password reset successfully!' }));
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          </div>

          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {state.error}
            </div>
          )}

          {state.message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              {state.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={state.password}
                onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={state.confirmPassword}
                onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors"
            >
              {state.loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <NavLink to="/" className="text-green-600 hover:text-green-700 font-medium">
              ← Back to Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}