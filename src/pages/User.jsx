import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Service from '../API/api';
import PhotosGrid from '../components/PhotosGrid';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';

export default function User() {
  const {username} = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.user);
  const { isDark } = useTheme();

  const [state, setState] = useState({
    user: {},
    userPhotos: [],
    isLoading: true,
    isFollowing: false,
    followLoading: false
  });

  useEffect(() => {
    const checkFollowingStatus = () => {
      if (!currentUser || !state.user.username) return false;

      const following = JSON.parse(localStorage.getItem(`following_${currentUser.username}`) || '[]');
      return following.includes(state.user.username);
    };

    setState(prev => ({
      ...prev,
      isFollowing: checkFollowingStatus()
    }));
  }, [currentUser, state.user.username]);

  useEffect(() => {
    (async () => {
      try {
        const userData = await Service.getUser(username);
        const photosData = await Service.getUserPhotos(username);

        setState(prev => ({
          ...prev,
          user: userData,
          userPhotos: photosData,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setState(prev => ({...prev, isLoading: false}));
      }
    })();
  }, [username]);

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    if (currentUser.username === state.user.username) {
      alert("You can't follow yourself!");
      return;
    }

    setState(prev => ({ ...prev, followLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const followingKey = `following_${currentUser.username}`;
      const followersKey = `followers_${state.user.username}`;

      let following = JSON.parse(localStorage.getItem(followingKey) || '[]');
      let followers = JSON.parse(localStorage.getItem(followersKey) || '[]');

      if (state.isFollowing) {
        following = following.filter(user => user !== state.user.username);
        followers = followers.filter(user => user !== currentUser.username);
      } else {
        if (!following.includes(state.user.username)) {
          following.push(state.user.username);
        }
        if (!followers.includes(currentUser.username)) {
          followers.push(currentUser.username);
        }
      }

      localStorage.setItem(followingKey, JSON.stringify(following));
      localStorage.setItem(followersKey, JSON.stringify(followers));

      setState(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followLoading: false,
        user: {
          ...prev.user,
          followers_count: state.isFollowing
            ? Math.max(0, prev.user.followers_count - 1)
            : prev.user.followers_count + 1
        }
      }));

    } catch (error) {
      console.error('Follow error:', error);
      setState(prev => ({ ...prev, followLoading: false }));
    }
  };

  const getEffectiveFollowersCount = () => {
    const baseCount = state.user.followers_count || 0;
    if (!currentUser) return baseCount;

    const followersKey = `followers_${state.user.username}`;
    const localFollowers = JSON.parse(localStorage.getItem(followersKey) || '[]');
    const uniqueFollowers = new Set([...localFollowers]);

    return Math.max(baseCount, uniqueFollowers.size);
  };

  if (state.isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
          </div>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>User not found</h1>
          <p className={`mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>The user @{username} doesn't exist.</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === state.user.username;
  const effectiveFollowersCount = getEffectiveFollowersCount();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center mb-8 transition-colors group ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          Back
        </button>

        <div className={`rounded-2xl shadow-sm border p-8 mb-8 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <img
                src={state.user.profile_image?.large}
                alt={state.user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold truncate">
                    {state.user.name}
                  </h1>
                  <p className={`text-lg mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>@{state.user.username}</p>
                </div>

                {!isOwnProfile && currentUser && (
                  <button
                    onClick={handleFollow}
                    disabled={state.followLoading}
                    className={`mt-4 sm:mt-0 px-6 py-2 rounded-lg font-medium transition-colors ${
                      state.isFollowing
                        ? isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } ${state.followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {state.followLoading ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        {state.isFollowing ? 'Unfollowing...' : 'Following...'}
                      </span>
                    ) : (
                      state.isFollowing ? 'Following' : 'Follow'
                    )}
                  </button>
                )}

                {isOwnProfile && (
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className={`mt-4 sm:mt-0 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium border ${
                      isDark
                        ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {state.user.bio && (
                <p className={`mt-4 text-lg leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {state.user.bio}
                </p>
              )}

              <div className="flex space-x-8 mt-6">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📷</span>
                  <div>
                    <div className="text-2xl font-bold">
                      {state.user.total_photos?.toLocaleString() || 0}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Photos</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <div className="text-2xl font-bold">
                      {effectiveFollowersCount.toLocaleString()}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Followers</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔍</span>
                  <div>
                    <div className="text-2xl font-bold">
                      {state.user.following_count?.toLocaleString() || 0}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Following</div>
                  </div>
                </div>
              </div>

              {(state.user.location || state.user.portfolio_url) && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {state.user.location && (
                    <span className={`inline-flex items-center ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      📍 {state.user.location}
                    </span>
                  )}
                  {state.user.portfolio_url && (
                    <a
                      href={state.user.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      🌐 Portfolio
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm border p-8 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Photos
              {state.userPhotos.length > 0 && (
                <span className={`text-lg font-normal ml-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  ({state.userPhotos.length})
                </span>
              )}
            </h2>
          </div>

          {state.userPhotos.length > 0 ? (
            <PhotosGrid photos={state.userPhotos} isLoading={false} />
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📸</div>
              <h3 className={`text-lg font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>No photos yet</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                This user hasn't shared any photos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}