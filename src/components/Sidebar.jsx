import {useState, useEffect} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from '../hooks/useTranslation';
import {useTheme} from '../hooks/useTheme';
import {logout} from "../redux/reducers/auth";
import ConfirmModal from "./ConfirmModal.jsx";
import SettingsModal from "./SettingsModal.jsx";
import {clearCurrentFavorites} from "../redux/reducers/favorites.js";
import Logout from '../assets/icons/logout.svg?react'
import Logo from '../assets/icons/logo.svg?react'
import Settings from '../assets/icons/settings.svg?react'
import Home from '../assets/icons/Home.svg?react'
import Books from '../assets/icons/books.svg?react'
import Illustrations from '../assets/icons/Illustration.svg?react'
import Photo from '../assets/icons/Photo.svg?react'
import Admin from '../assets/icons/admin.svg?react'
import Star from '../assets/icons/Star.svg?react'

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {isDark} = useTheme();
  const isLoggedIn = useSelector(state => state.auth?.isLoggedIn);
  const user = useSelector(state => state.auth?.user);

  const [localUser, setLocalUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  const iconClass = isDark
    ? "text-gray-300"
    : "text-gray-600";

  const activeIconClass = isDark
    ? "text-white"
    : "text-gray-900";

  const handleLogout = () => {
    dispatch(clearCurrentFavorites());
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", {replace: true});
  };

  const handlePremiumClick = () => {
    setShowPremiumModal(true);
  };

  const handleUpgrade = () => {
    setShowPremiumModal(false);
    setShowDemoAlert(true);
  };

  return (
    <>
      <div className={`flex flex-col justify-between h-screen w-64 border-r p-6 transition-colors ${
        isDark
          ? 'bg-gray-900 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <NavLink to="/home">
              <Logo className={`w-9 h-9 ${isDark ? 'icon-dark' : '#000'}`}/>
            </NavLink>
            <span className="text-xl font-bold">Unsplash</span>
          </div>

          <nav className="space-y-2">
            <NavLink
              to="/home"
              className={({isActive}) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? (isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900')
                    : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Home className={`w-5 h-5 ${isActive ? activeIconClass : iconClass}`} />
                  <span>{t('nav.home')}</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/photos"
              className={({isActive}) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? (isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900')
                    : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Photo className={`w-5 h-5 ${isActive ? activeIconClass : iconClass}`} />
                  <span>{t('nav.photos')}</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/illustrations"
              className={({isActive}) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? (isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900')
                    : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Illustrations className={`w-5 h-5 ${isActive ? activeIconClass : iconClass}`} />
                  <span>{t('nav.illustrations')}</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/collections"
              className={({isActive}) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? (isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900')
                    : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Books className={`w-5 h-5 ${isActive ? activeIconClass : iconClass}`} />
                  <span>{t('nav.collections')}</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/favorites"
              className={({isActive}) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? (isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900')
                    : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Star className={`w-5 h-5 ${isActive ? activeIconClass : iconClass}`} />
                  <span>{t('nav.favorites')}</span>
                </>
              )}
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({isActive}) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? (isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900')
                      : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Admin className={`w-5 h-5 ${isActive ? activeIconClass : iconClass}`} />
                    <span>{t('nav.admin')}</span>
                  </>
                )}
              </NavLink>
            )}
          </nav>

          <div className="pt-4">
            <button
              onClick={handlePremiumClick}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Premium Features
            </button>
          </div>
        </div>

        {isLoggedIn && userToDisplay && (
          <div className="space-y-4 border-t pt-4" style={{borderColor: isDark ? '#374151' : '#e5e7eb'}}>
            <div
              onClick={() => navigate("/profile")}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              }`}
            >
              {userToDisplay?.image ? (
                <img
                  src={userToDisplay.image}
                  alt={userToDisplay.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {userToDisplay?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userToDisplay.username}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('nav.viewProfile')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className={`flex items-center space-x-3 w-full px-4 py-2 text-sm rounded-lg transition-colors ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5"/>
              <span>Settings</span>
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex items-center space-x-3 w-full px-4 py-2 text-sm rounded-lg transition-colors ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Logout className="w-5 h-5"/>
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        message="Are you sure you want to log out?"
        onConfirm={() => {
          handleLogout();
          setShowLogoutConfirm(false);
        }}
        onCancel={() => setShowLogoutConfirm(false)}
        type="warning"
        confirmText="Log Out"
        cancelText="Stay"
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl max-w-md w-full ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className={`p-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className="text-xl font-bold">🚀 Premium Features</h3>
              <p className={isDark ? 'text-gray-300 mt-2' : 'text-gray-600 mt-2'}>
                Enhance your experience with these features
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <h4 className="font-semibold">Unlimited Favorites</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Save as many photos as you want
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <h4 className="font-semibold">Ad-Free Experience</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Browse without interruptions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <h4 className="font-semibold">HD Downloads</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Download photos in high quality
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <h4 className="font-semibold">Custom Collections</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Create unlimited collections
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${
              isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDemoAlert}
        title="Demo Version"
        message="This is a demo version. Premium features are not available for purchase in this demonstration."
        onConfirm={() => setShowDemoAlert(false)}
        onCancel={() => setShowDemoAlert(false)}
        type="info"
        confirmText="Got it"
        cancelText="Close"
      />
    </>
  );
}