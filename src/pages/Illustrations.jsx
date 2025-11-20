import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIllustrations } from "../hooks/useIllustrations";
import PhotosGrid from "../components/PhotosGrid.jsx";
import Loader from "../components/Loader.jsx";
import SearchModal from "../components/SearchModal.jsx";
import Logo from '../assets/icons/logo.svg?react';
import { useTheme } from '../hooks/useTheme';
import Search from '../assets/icons/Search.svg?react'

export default function Illustrations() {
  const { state, handleSearch, handleLoadMore } = useIllustrations();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [illustrationTopics, setIllustrationTopics] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    const topics = [
      { name: 'Wallpapers', count: '45K', searchTerm: 'wallpaper' },
      { name: '3D', count: '32K', searchTerm: '3d' },
      { name: 'Flat', count: '28K', searchTerm: 'flat' },
      { name: 'Hand Drawn', count: '15K', searchTerm: 'hand drawn' },
      { name: 'Icons', count: '12K', searchTerm: 'icons' },
      { name: 'Line Art', count: '8K', searchTerm: 'line art' },
      { name: 'Patterns', count: '6K', searchTerm: 'patterns' }
    ];
    setIllustrationTopics(topics);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      handleSearch('illustration');
    }
  }, [location.search, handleSearch]);

  const handleIllustrationSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
      navigate(`/illustrations?search=${encodeURIComponent(searchTerm)}`, { replace: true });
    }
  };

  const handleTopicClick = (searchTerm) => {
    handleIllustrationSearch(searchTerm);
  };

  const getDisplayQuery = () => {
    if (!state.query) return '';
    return state.query.replace(' illustration', '');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {state.isLoadingPhotos && state.page === 1 && <Loader />}

      <section className={`relative py-20 px-6 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-purple-900 to-pink-900'
          : 'bg-gradient-to-br from-purple-50 to-pink-100'
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            <h1 className={`text-3xl font-bold ml-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Unsplash</h1>
          </div>
          <h2 className={`text-4xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Beautiful, free illustrations
          </h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Discover the world's most inspiring illustrations from talented creators.
          </p>

          <div className="max-w-2xl mx-auto">
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className={`rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 group ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Search className={`w-6 h-6 mr-3 transition-colors duration-300 ${
                  isDark
                    ? 'text-gray-400 group-hover:text-gray-300'
                    : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                <span className={`text-lg transition-colors duration-300 ${
                  isDark
                    ? 'text-gray-300 group-hover:text-white'
                    : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  Search illustrations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-16 px-6 border-b transition-colors duration-300 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl font-bold mb-8 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {illustrationTopics.map((topic, index) => (
              <div
                key={index}
                onClick={() => handleTopicClick(topic.searchTerm)}
                className={`rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
                }`}
              >
                <h3 className="font-semibold text-lg mb-2">{topic.name}</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{topic.count} illustrations</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 px-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl font-bold mb-8 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Popular Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => handleTopicClick('summer colors')}
              className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-red-500 h-48 flex items-center justify-center">
                <span className="text-white text-xl font-bold">The Colors of Summer</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white text-sm">45 images</p>
              </div>
            </div>

            <div
              onClick={() => handleTopicClick('unique art')}
              className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-blue-400 to-purple-600 h-48 flex items-center justify-center">
                <span className="text-white text-xl font-bold">One of a Kind</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white text-sm">30 images</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            onClick={() => handleTopicClick('halloween')}
            className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg p-8 cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold text-white mb-2">This is Halloween</h3>
            <p className="text-white text-lg mb-4">Spooky illustrations for the season</p>
            <p className="text-white text-sm">40 images</p>
          </div>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {state.query && getDisplayQuery() !== 'illustration' && (
            <h2 className={`text-2xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Illustration results for "{getDisplayQuery()}"
            </h2>
          )}
          {(!state.query || getDisplayQuery() === 'illustration') && (
            <h2 className={`text-2xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Featured Illustrations</h2>
          )}

          <PhotosGrid
            photos={state.photos}
            isLoading={state.isLoadingPhotos}
            onLoadMore={handleLoadMore}
            hasMore={state.hasMore}
          />
        </div>
      </section>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleIllustrationSearch}
        currentQuery={getDisplayQuery()}
      />
    </div>
  );
}