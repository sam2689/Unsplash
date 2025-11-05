// pages/Illustrations.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIllustrations } from "../hooks/useIllustrations"; // Новый хук
import PhotosGrid from "../components/PhotosGrid.jsx";
import Loader from "../components/Loader.jsx";
import SearchModal from "../components/SearchModal.jsx";
import Logo from '../assets/icons/logo.svg?react';

export default function Illustrations() {
  const { state, handleSearch, handleLoadMore } = useIllustrations(); // Используем новый хук
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [illustrationTopics, setIllustrationTopics] = useState([]);

  // Темы для иллюстраций как в реальном Unsplash
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

  // Обрабатываем URL параметры
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      // Если нет поиска, загружаем иллюстрации по умолчанию
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

  // Функция для отображения чистого query (без "illustration")
  const getDisplayQuery = () => {
    if (!state.query) return '';
    return state.query.replace(' illustration', '');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Показываем лоадер на весь экран при загрузке ТОЛЬКО ПЕРВОЙ СТРАНИЦЫ */}
      {state.isLoadingPhotos && state.page === 1 && <Loader />}

      {/* Hero Section для иллюстраций */}
      <section className="relative bg-gradient-to-br from-purple-50 to-pink-100 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo />
            <h1 className="text-3xl font-bold ml-2">Unsplash</h1>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Beautiful, free illustrations
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the world's most inspiring illustrations from talented creators.
          </p>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center text-gray-400">
                <span className="text-lg mr-3">🔍</span>
                <span className="text-gray-500 text-lg">Search illustrations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Illustration Topics */}
      <section className="py-16 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {illustrationTopics.map((topic, index) => (
              <div
                key={index}
                onClick={() => handleTopicClick(topic.searchTerm)}
                className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{topic.name}</h3>
                <p className="text-gray-500 text-sm">{topic.count} illustrations</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Illustration Collections */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Collections</h2>
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

      {/* Halloween Section */}
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

      {/* Upload Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload your first SVG</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Your illustrations, everywhere. No need to be a pro—anyone can contribute.
            </p>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Submit an illustration
            </button>
          </div>
        </div>
      </section>

      {/* Photos Grid для результатов поиска - ВСЕГДА ПОКАЗЫВАЕМ */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок результатов */}
          {state.query && getDisplayQuery() !== 'illustration' && (
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Illustration results for "{getDisplayQuery()}"
            </h2>
          )}
          {(!state.query || getDisplayQuery() === 'illustration') && (
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Illustrations</h2>
          )}

          <PhotosGrid
            photos={state.photos}
            isLoading={state.isLoadingPhotos}
            onLoadMore={handleLoadMore}
            hasMore={state.hasMore}
          />
        </div>
      </section>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleIllustrationSearch}
        currentQuery={getDisplayQuery()}
      />
    </div>
  );
}