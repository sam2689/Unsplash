import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logout} from "../redux/reducers/auth";
import LoginService from "../API/login.js";

export default function DeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

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
        navigate('/', {replace: true});
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Failed to delete account. Please try again.");
    }
      setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-red-600">Delete Account</h2>

      <div className="bg-red-100 border border-red-300 p-4 rounded mb-4">
        <p className="text-red-800 font-semibold">Warning: This action cannot be undone!</p>
        <p className="text-red-700 text-sm mt-2">
          All your data will be permanently deleted. This includes your profile information and any other associated
          data.
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmText">
          To confirm, type your username <span className="font-mono">"{user?.username}"</span>
        </label>
        <input
          id="confirmText"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Enter your username"
        />
      </div>

      <button
        onClick={handleDelete}
        disabled={loading || confirmText !== user?.username}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300 transition"
      >
        {loading ? 'Deleting...' : 'Permanently Delete My Account'}
      </button>
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition mt-2"
      >
        Cancel
      </button>
    </div>
  );
}