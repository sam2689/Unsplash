// pages/Photos.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePhotos } from "../hooks/usePhoto";
import SearchWithFilters from "../components/SearchWithFilters.jsx";
import PhotosGrid from "../components/PhotosGrid.jsx";
import Loader from "../components/Loader.jsx";
import Logo from '../assets/icons/logo.svg?react';
import FeaturedTopics from "../components/FeaturedTopics.jsx";

export default function Photos() {
  const { state, dispatch, handleSearch, handleLoadMore } = usePhotos();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  // Обрабатываем URL параметры при загрузке страницы
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const topicQuery = searchParams.get('topic');

    console.log('📋 URL Params:', { searchQuery, topicQuery });

    if (searchQuery && !initialized) {
      console.log('🎯 Setting search query from URL:', searchQuery);
      // Используем handleSearch чтобы сработал debounce и загрузка
      handleSearch(searchQuery);
      setInitialized(true);
    } else if (topicQuery && !initialized) {
      console.log('🎯 Setting topic from URL:', topicQuery);
      // Для тем используем SET_TOPIC
      dispatch({ type: 'SET_TOPIC', payload: topicQuery });
      setInitialized(true);
    } else if (!initialized) {
      // Если нет параметров, загружаем обычные фото
      console.log('🎯 No URL params, loading default photos');
      setInitialized(true);
    }
  }, [location.search, dispatch, initialized, handleSearch]);

  // Функция поиска которая обновляет URL
  const handleSearchWithURL = (searchTerm) => {
    if (searchTerm.trim()) {
      console.log('🔍 Search with URL:', searchTerm);
      handleSearch(searchTerm);
      // Обновляем URL с поисковым запросом
      navigate(`/photos?search=${encodeURIComponent(searchTerm)}`, { replace: true });
    }
  };
  const handleTopicClick = (topic) => {
    console.log('🎯 Topic clicked:', topic);
    // Для тем используем поиск, а не SET_TOPIC
    handleSearch(topic);
  };

  console.log('📊 Photos state:', {
    query: state.query,
    topic: state.topic,
    photosCount: state.photos.length,
    isLoading: state.isLoadingPhotos
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Показываем лоадер на весь экран при загрузке ТОЛЬКО ПЕРВОЙ СТРАНИЦЫ */}
      {state.isLoadingPhotos && state.page === 1 && <Loader />}

      <section className="py-16 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured</h2>
          <FeaturedTopics onTopicClick={handleTopicClick} />
        </div>
      </section>

      {/* Photos Grid */}
      {(state.photos.length > 0 || state.query || state.topic || state.activeCollection) && (
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Заголовок результатов */}
            {state.query && (
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Search results for "{state.query}"
              </h2>
            )}
            {state.topic && !state.query && (
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Topic: {state.topic}
              </h2>
            )}
            {state.activeCollection && !state.query && !state.topic && (
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
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

      {/* Сообщение когда нет результатов */}
      {state.photos.length === 0 && !state.isLoadingPhotos && (state.query || state.topic) && (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}