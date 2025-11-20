import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {usePhotos} from "../hooks/usePhoto";
import PhotosGrid from "../components/PhotosGrid.jsx";
import FeaturedTopics from "../components/FeaturedTopics.jsx";
import CollectionsCarousel from "../components/CollectionsCarousel.jsx";
import SearchModal from "../components/SearchModal.jsx";
import {useTheme} from '../hooks/useTheme';
import Search from '../assets/icons/Search.svg?react'

export default function Home() {
  const {state, handleLoadMore} = usePhotos();
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const {isDark} = useTheme();

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      console.log('🔍 Searching for:', searchTerm);
      navigate(`/photos?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleTopicClick = (topic) => {
    console.log('🎯 Topic clicked:', topic);
    handleSearch(topic);
  };

  const handleCollectionClick = (collectionTitle) => {
    console.log('📚 Collection clicked:', collectionTitle);
    handleSearch(collectionTitle);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <section className={`relative py-20 px-6 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-blue-900 to-indigo-900'
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            The internet's source for visuals
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Powered by creators everywhere.
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
                }`}/>
                <span className={`text-lg transition-colors duration-300 ${
                  isDark
                    ? 'text-gray-300 group-hover:text-white'
                    : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  Search photos and illustrations
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
          <FeaturedTopics onTopicClick={handleTopicClick}/>
        </div>
      </section>

      <section className={`py-16 px-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl font-bold mb-8 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Collections</h2>
          <CollectionsCarousel onCollectionClick={handleCollectionClick}/>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Featured Photos</h2>
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
        onSearch={handleSearch}
        currentQuery=""
      />
    </div>
  );
}