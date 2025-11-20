import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginService from '../API/login.js';
import Logo from '../assets/icons/logo.svg?react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: '',
    loading: false,
    message: '',
    error: '',
    step: 'request'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const result = await LoginService.requestPasswordReset(state.email);
      setState(prev => ({
        ...prev,
        loading: false,
        message: result.message,
        step: 'instructions',
        demoToken: result.demoToken
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Функция для перехода к сбросу пароля
  const handleContinueToReset = () => {
    if (state.demoToken) {
      // Сохраняем токен в localStorage для проверки
      localStorage.setItem('resetToken', state.demoToken);
      navigate('/reset-password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {state.step === 'request' ? 'Forgot Password' : 'Check Your Email'}
            </h1>
            <p className="text-gray-600">
              {state.step === 'request' ? "Enter your email and we'll send you reset instructions" :
                "We've sent password reset instructions to your email"}
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

          {state.step === 'request' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={state.loading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 disabled:bg-orange-400 transition-colors"
              >
                {state.loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          )}

          {state.step === 'instructions' && (
            <div className="text-center">
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-700 mb-4">
                  Check your email for reset instructions.
                </p>
                {state.demoToken && (
                  <button
                    onClick={handleContinueToReset}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors"
                  >
                    Continue to Reset Password (Demo)
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <NavLink
              to="/"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Back to Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}