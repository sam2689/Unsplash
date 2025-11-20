import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import LoginService from "../API/login.js";
import Loader from "../components/Loader.jsx";
import {NavLink} from "react-router-dom";
import { useTheme } from '../hooks/useTheme';

export default function Profile() {
  const token = useSelector(state => state.auth.token);
  const userData = useSelector(state => state.auth.user);
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const { isDark } = useTheme();

  const availableInterests = [
    "Photography", "Nature", "Travel", "Portrait", "Landscape",
    "Street Photography", "Wildlife", "Architecture", "Food", "Fashion",
    "Black & White", "Abstract", "Macro", "Sports", "Urban",
    "Minimalism", "Vintage", "Art", "Adventure", "Night Photography"
  ];

  const interestColors = {
    "Photography": "bg-purple-100 text-purple-800",
    "Nature": "bg-green-100 text-green-800",
    "Travel": "bg-blue-100 text-blue-800",
    "Portrait": "bg-pink-100 text-pink-800",
    "Landscape": "bg-emerald-100 text-emerald-800",
    "Street Photography": "bg-orange-100 text-orange-800",
    "Wildlife": "bg-lime-100 text-lime-800",
    "Architecture": "bg-cyan-100 text-cyan-800",
    "Food": "bg-rose-100 text-rose-800",
    "Fashion": "bg-fuchsia-100 text-fuchsia-800",
    "Black & White": "bg-gray-100 text-gray-800",
    "Abstract": "bg-indigo-100 text-indigo-800",
    "Macro": "bg-teal-100 text-teal-800",
    "Sports": "bg-red-100 text-red-800",
    "Urban": "bg-slate-100 text-slate-800",
    "Minimalism": "bg-stone-100 text-stone-800",
    "Vintage": "bg-amber-100 text-amber-800",
    "Art": "bg-violet-100 text-violet-800",
    "Adventure": "bg-sky-100 text-sky-800",
    "Night Photography": "bg-blue-100 text-blue-800"
  };

  useEffect(() => {
    if (userData && userData.id) {
      setUser(userData);
      const savedInterests = JSON.parse(localStorage.getItem(`interests_${userData.id}`)) || [];
      setSelectedInterests(savedInterests);
      return;
    }

    if (token && (!userData || !userData.id)) {
      setLoading(true);
      (async () => {
        try {
          const data = await LoginService.getUserInfo(token);
          setUser(data);
          const savedInterests = JSON.parse(localStorage.getItem(`interests_${data.id}`)) || [];
          setSelectedInterests(savedInterests);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
        setLoading(false);
      })();
    }
  }, [token, userData]);

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => {
      let newInterests;
      if (prev.includes(interest)) {
        newInterests = prev.filter(i => i !== interest);
      } else {
        newInterests = [...prev, interest];
      }

      if (user?.id) {
        localStorage.setItem(`interests_${user.id}`, JSON.stringify(newInterests));
      }

      return newInterests;
    });
  };

  const removeInterest = (interest) => {
    setSelectedInterests(prev => {
      const newInterests = prev.filter(i => i !== interest);

      if (user?.id) {
        localStorage.setItem(`interests_${user.id}`, JSON.stringify(newInterests));
      }

      return newInterests;
    });
  };

  if (loading) return <Loader/>;

  if (!user) return (
    <div className={`text-center mt-8 ${
      isDark ? 'text-gray-400' : 'text-gray-600'
    }`}>User data not available</div>
  );

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className={`rounded-xl shadow-sm border p-6 mb-6 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>@{user.username}</p>

              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-lg font-semibold">0</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">0</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">0</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Collections</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 mb-6 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <h2 className="text-lg font-semibold mb-4">About</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium w-1/3 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Email</span>
              <span className="text-sm w-2/3 text-right">{user.email}</span>
            </div>

            {user.phone && (
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium w-1/3 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Phone</span>
                <span className="text-sm w-2/3 text-right">{user.phone}</span>
              </div>
            )}

            {user.birthDate && (
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium w-1/3 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Birth Date</span>
                <span className="text-sm w-2/3 text-right">{user.birthDate}</span>
              </div>
            )}

            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium w-1/3 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Location</span>
              <span className="text-sm w-2/3 text-right">Armenia</span>
            </div>

            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium w-1/3 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Bio</span>
              <span className="text-sm w-2/3 text-right text-left">
                Hello there! I am a Junior Front-End developer from Armenia.
                I'm 17 years old and I know JavaScript, Framework React.js and React Native
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium w-1/3 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Interests</span>
              <div className="w-2/3 flex flex-wrap gap-2 justify-end">
                {selectedInterests.map(interest => (
                  <span
                    key={interest}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      interestColors[interest] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setShowInterestModal(true)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  + Add interest
                </button>
              </div>
            </div>
          </div>
        </div>

        {showInterestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <div className={`p-6 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className="text-lg font-semibold">Select Your Interests</h3>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Choose topics you're passionate about</p>
              </div>

              <div className="p-6 overflow-y-auto max-h-96">
                <div className="grid grid-cols-2 gap-2">
                  {availableInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedInterests.includes(interest)
                          ? `${interestColors[interest] || 'bg-blue-100 text-blue-800'} ring-2 ring-offset-1 ring-current`
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-6 border-t ${
                isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {selectedInterests.length} selected
                  </span>
                  <button
                    onClick={() => setShowInterestModal(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`rounded-xl shadow-sm border p-6 mb-6 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Social</h2>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Instagram username</label>
              <input
                type="text"
                placeholder="username"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'border-gray-300'
                }`}
              />
              <p className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>So that we can feature you on @unsplash</p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>X (Twitter) username</label>
              <input
                type="text"
                placeholder="username"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'border-gray-300'
                }`}
              />
              <p className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>So that we can feature you on @unsplash</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 mb-6 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Donations</h2>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              PayPal email or username for donations
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <div className="flex space-x-3">
            <NavLink
              to="/edit-profile"
              className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </NavLink>
            <NavLink
              to="/delete-account"
              className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete Account
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}