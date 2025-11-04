// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/reducers/auth";

import ConfirmModal from "./ConfirmModal.jsx";

import HomeIcon from '../assets/icons/home.svg?react';
import Star from '../assets/icons/star.svg?react';
import Logout from '../assets/icons/logout.svg?react';
import Admin from '../assets/icons/admin.svg?react';

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
      <div className="flex flex-col justify-between h-screen w-20 bg-white shadow-lg p-4">
        {/* Навигация сверху */}
        <div className="flex flex-col space-y-6">
          <NavLink to="/home" className="flex justify-center">
            <HomeIcon className="w-6 h-6 text-gray-700 hover:text-orange-600"/>
          </NavLink>
          <NavLink to="/favorites" className="flex justify-center">
            <Star className="w-6 h-6 text-gray-700 hover:text-orange-600"/>
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="flex justify-center">
              <Admin className="w-6 h-6 text-gray-700 hover:text-orange-600"/>
            </NavLink>
          )}
        </div>

        {/* Профиль и logout снизу */}
        {isLoggedIn && (
          <div className="flex flex-col items-center space-y-4">
            {userToDisplay?.image ? (
              <img
                src={userToDisplay.image}
                alt={userToDisplay.username}
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
              />
            ) : (
              <div
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center bg-gray-200"
              >
                {userToDisplay?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Logout className="w-6 h-6 text-gray-700"/>
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        message="Are you sure you want to exit?"
        onConfirm={() => { handleLogout(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
