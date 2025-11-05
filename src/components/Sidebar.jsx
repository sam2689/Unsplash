// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/reducers/auth";
import ConfirmModal from "./ConfirmModal.jsx";
import Logout from '../assets/icons/logout.svg?react'
import Logo from '../assets/icons/logo.svg?react'

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth?.isLoggedIn);
  const user = useSelector(state => state.auth?.user);

  const [localUser, setLocalUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user && isLoggedIn) {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        try {
          setLocalUser(JSON.parse(userData));
        } catch (error) {
          console.error("Failed to parse user data:", error);
        }
      }
    }
  }, [user, isLoggedIn]);

  const userToDisplay = user || localUser;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="flex flex-col justify-between h-screen w-64 bg-white border-r border-gray-200 p-6">
        {/* Логотип и основная навигация */}
        <div className="space-y-8">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <NavLink
              to="/home"
            >
           <Logo/>
            </NavLink>
            <span className="text-xl font-bold text-gray-900">Unsplash</span>
          </div>

          {/* Основная навигация */}
          <nav className="space-y-2">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span>🏠</span>
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/photos"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span>📷</span>
              <span>Photos</span>
            </NavLink>

            <NavLink
              to="/illustrations"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span>🎨</span>
              <span>Illustrations</span>
            </NavLink>

            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span>📚</span>
              <span>Collections</span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span>⭐</span>
              <span>Favorites</span>
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span>⚙️</span>
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* Unsplash+ кнопка */}
          <div className="pt-4">
            <button className="w-full bg-black text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Get Unsplash+
            </button>
          </div>
        </div>

        {/* Профиль пользователя */}
        {isLoggedIn && userToDisplay && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {userToDisplay?.image ? (
                <img
                  src={userToDisplay.image}
                  alt={userToDisplay.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {userToDisplay?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userToDisplay.username}
                </p>
                <p className="text-xs text-gray-500">View profile</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Logout className="w-6 h-6 text-gray-700"/>
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        message="Are you sure you want to log out?"
        onConfirm={() => { handleLogout(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}