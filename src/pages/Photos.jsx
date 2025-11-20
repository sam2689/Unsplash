import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {usePhotos} from "../hooks/usePhoto";
import PhotosGrid from "../components/PhotosGrid.jsx";
import Loader from "../components/Loader.jsx";
import {useTheme} from '../hooks/useTheme';

export default function Photos() {
  const {state, dispatch, handleSearch, handleLoadMore} = usePhotos();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const {isDark} = useTheme();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const topicQuery = searchParams.get('topic');

    console.log('📋 URL Params:', {searchQuery, topicQuery});

    if (searchQuery && !initialized) {
      console.log('🎯 Setting search query from URL:', searchQuery);
      handleSearch(searchQuery);
      setInitialized(true);
    } else if (topicQuery && !initialized) {
      console.log('🎯 Setting topic from URL:', topicQuery);
      dispatch({type: 'SET_TOPIC', payload: topicQuery});
      setInitialized(true);
    } else if (!initialized) {
      console.log('🎯 No URL params, loading default photos');
      setInitialized(true);
    }
  }, [location.search, dispatch, initialized, handleSearch]);

  console.log('📊 Photos state:', {
    query: state.query,
    topic: state.topic,
    photosCount: state.photos.length,
    isLoading: state.isLoadingPhotos
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {state.isLoadingPhotos && state.page === 1 && <Loader/>}

      {(state.photos.length > 0 || state.query || state.topic || state.activeCollection) && (
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {state.query && (
              <h2 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Search results for "{state.query}"
              </h2>
            )}
            {state.topic && !state.query && (
              <h2 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Topic: {state.topic}
              </h2>
            )}
            {state.activeCollection && !state.query && !state.topic && (
              <h2 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
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

      {state.photos.length === 0 && !state.isLoadingPhotos && (state.query || state.topic) && (
        <div className="text-center py-16">
          <h3 className={`text-xl font-medium mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>No photos found</h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}