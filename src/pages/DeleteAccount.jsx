import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/reducers/auth";
import LoginService from "../API/login.js";
import { useTheme } from '../hooks/useTheme';

export default function DeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== user.username) {
      setMessage(`Please type "${user.username}" to confirm deletion`);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await LoginService.deleteUser(user.id, token);
      dispatch(logout());
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setMessage("Account deleted successfully. Redirecting...");
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Failed to delete account. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-600">Delete Account</h2>
            <button
              onClick={() => navigate('/profile')}
              className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
            >
              ✕
            </button>
          </div>

          <div className={`rounded-lg p-4 mb-6 ${
            isDark
              ? 'bg-red-900 border-red-700'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  isDark ? 'text-red-200' : 'text-red-800'
                }`}>Warning: This action cannot be undone!</h3>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-red-300' : 'text-red-700'
                }`}>
                  All your data will be permanently deleted. This includes your profile information, photos, and any other associated data.
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes("success")
                ? isDark
                  ? "bg-green-900 text-green-200 border border-green-700"
                  : "bg-green-50 text-green-800 border border-green-200"
                : isDark
                  ? "bg-red-900 text-red-200 border border-red-700"
                  : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To confirm, type your username: <span className="font-mono text-red-600">"{user?.username}"</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300'
              }`}
              placeholder="Enter your username"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={loading || confirmText !== user?.username}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-red-300 transition-colors"
            >
              {loading ? 'Deleting...' : 'Permanently Delete Account'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}