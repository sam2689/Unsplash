import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from '../API/login.js';
import Logo from '../assets/icons/logo.svg?react';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    loading: false,
    message: '',
    error: '',
    tokenValid: false,
    email: ''
  });

  useEffect(() => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('resetToken');
    console.log('Retrieved token:', token); // Для отладки

    if (token) {
      const validation = LoginService.validateResetToken(token);
      console.log('Token validation:', validation); // Для отладки

      if (validation.valid) {
        setState(prev => ({
          ...prev,
          tokenValid: true,
          email: validation.email
        }));
      } else {
        setState(prev => ({
          ...prev,
          tokenValid: false,
          error: validation.message
        }));
        // Удаляем невалидный токен
        localStorage.removeItem('resetToken');
      }
    } else {
      setState(prev => ({
        ...prev,
        tokenValid: false,
        error: 'No reset token found. Please request a new reset link.'
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      setState(prev => ({ ...prev, error: 'Passwords do not match' }));
      return;
    }

    // Валидация сложности пароля
    const passwordValidation = LoginService.validatePasswordStrength(state.password);
    if (!passwordValidation.valid) {
      setState(prev => ({ ...prev, error: passwordValidation.message }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const token = localStorage.getItem('resetToken');
      const result = await LoginService.resetPassword(token, state.password);

      setState(prev => ({
        ...prev,
        loading: false,
        message: result.message
      }));

      // Очищаем токен после успешного сброса
      localStorage.removeItem('resetToken');

      // Перенаправляем на страницу логина через 2 секунды
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const handleRequestNewLink = () => {
    localStorage.removeItem('resetToken');
    navigate('/forgot-password');
  };

  if (!state.tokenValid && state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <button
              onClick={handleRequestNewLink}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">
              Enter your new password for {state.email}
            </p>
          </div>

          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {state.error}
            </div>
          )}

          {state.message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {state.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={state.password}
                onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter new password"
                required
                minLength="6"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters and not too common
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={state.confirmPassword}
                onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 disabled:bg-orange-400 transition-colors"
            >
              {state.loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}