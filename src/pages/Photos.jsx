import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePhotos } from "../hooks/usePhoto";
import PhotosGrid from "../components/PhotosGrid.jsx";
import Loader from "../components/Loader.jsx";
import { useTheme } from '../hooks/useTheme';
import ColorFilter from "../components/ColorFilter.jsx";
import SearchModal from "../components/SearchModal.jsx";
import Search from '../assets/icons/Search.svg?react';
import Logo from "../assets/icons/logo.svg";

export default function Photos() {
  const { state, dispatch, handleSearch, handleLoadMore } = usePhotos();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { isDark } = useTheme();

  // Создаем стабильную версию handleSearch
  const stableHandleSearch = useCallback((query) => {
    return handleSearch(query);
  }, [handleSearch]);

  // Инициализация поиска из URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const topicQuery = searchParams.get('topic');

    if (searchQuery && !initialized) {
      stableHandleSearch(searchQuery);
      setSearchInput(searchQuery);
      setInitialized(true);
    } else if (topicQuery && !initialized) {
      dispatch({ type: 'SET_TOPIC', payload: topicQuery });
      setInitialized(true);
    } else if (!initialized) {
      setInitialized(true);
    }
  }, [location.search, dispatch, initialized, stableHandleSearch]);

  const onSearchSubmit = useCallback(() => {
    if (searchInput.trim()) {
      navigate(`/photos?search=${encodeURIComponent(searchInput)}`);
      stableHandleSearch(searchInput);
    }
  }, [searchInput, navigate, stableHandleSearch]);

  // Обработчик для поиска из модального окна
  const handleModalSearch = useCallback((term) => {
    setSearchInput(term);
    navigate(`/photos?search=${encodeURIComponent(term)}`);
    stableHandleSearch(term);
    setIsSearchModalOpen(false);
  }, [navigate, stableHandleSearch]);

  // Обработчик нажатия Enter в модальном окне
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  }, [onSearchSubmit]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>

      {/* Hero search gradient */}
      <section className={`relative py-20 px-6 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900'
          : 'bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50'
      }`}>

        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Explore amazing photos
          </h1>
          <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Search and filter by color to find exactly what you need.
          </p>

          {/* Search input */}
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
                }`}/>
                <span className={`text-lg transition-colors duration-300 ${
                  isDark
                    ? 'text-gray-300 group-hover:text-white'
                    : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {searchInput || 'Search photos and illustrations'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color filters */}
      <div className="mb-6 px-6 flex justify-center">
        <ColorFilter
          value={state.selectedColor}
          onChange={(color) => dispatch({ type: "SET_COLOR", payload: color })}
        />
      </div>

      {state.isLoadingPhotos && state.page === 1 && <Loader />}

      {/* Photos grid */}
      {(state.photos.length > 0 || state.query || state.topic || state.activeCollection) && (
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {state.query && (
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Search results for "{state.query}"
              </h2>
            )}
            {state.topic && !state.query && (
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Topic: {state.topic}
              </h2>
            )}
            {state.activeCollection && !state.query && !state.topic && (
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Collection photos
              </h2>
            )}

            <PhotosGrid
              photos={state.photos}
              isLoading={state.isLoadingPhotos}
              onLoadMore={handleLoadMore}
              hasMore={state.hasMore}
            />
          </div>
        </section>
      )}

      {/* Empty state */}
      {state.photos.length === 0 &&
        !state.isLoadingPhotos &&
        (state.query || state.topic || state.selectedColor || state.activeCollection) && (
          <div className="text-center py-16">
            <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No photos found
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Try adjusting your search or filters
            </p>
          </div>
        )}

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleModalSearch}
        currentQuery={searchInput}
      />
    </div>
  );
}