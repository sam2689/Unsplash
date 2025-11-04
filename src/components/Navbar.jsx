import {useEffect, useState} from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../redux/reducers/auth";

import ConfirmModal from "../components/ConfirmModal.jsx"; // твоя модалка

import HomeIcon from '../assets/icons/home.svg?react';
import Star from '../assets/icons/star.svg?react';
import Logout from '../assets/icons/logout.svg?react';
import Admin from '../assets/icons/admin.svg?react';

export default function Navbar() {
  const location = useLocation();
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
    navigate("/", {replace: true});
  };

  if (location.pathname === "/" || location.pathname === "/register") return null;

  return (
    <>
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <NavLink to="/home" className="flex items-center">
            <HomeIcon className="w-6 h-6"/>
          </NavLink>

          <NavLink
            to="/favorites"
            className="text-gray-700 hover:text-orange-600 focus:text-orange-600 flex items-center"
          >
            <Star className="w-6 h-6"/>
          </NavLink>
        </div>

        {isLoggedIn && (
          <div className="flex items-center space-x-3">
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className="text-gray-700 hover:text-orange-600 focus:text-orange-600"
              >
                <Admin className="w-10 h-10"/>
              </NavLink>
            )}
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
              onClick={() => setShowConfirm(true)} // открываем модалку вместо прямого logout
              className="px-4 py-1 rounded transition flex items-center text-gray-700 hover:text-orange-600 focus:text-orange-600"
            >
              <Logout className="w-6 h-6"/>
            </button>
          </div>
        )}
      </nav>

      <ConfirmModal
        isOpen={showConfirm}
        message="Are you sure you want to exit??"
        onConfirm={() => {
          handleLogout();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
