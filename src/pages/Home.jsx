// pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotos } from "../hooks/usePhoto";
import PhotosGrid from "../components/PhotosGrid.jsx";
import FeaturedTopics from "../components/FeaturedTopics.jsx";
import CollectionsCarousel from "../components/CollectionsCarousel.jsx";
import SearchModal from "../components/SearchModal.jsx";

export default function Home() {
  const { state, handleLoadMore } = usePhotos();
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      console.log('🔍 Searching for:', searchTerm);
      // Перенаправляем на страницу photos с поисковым запросом
      navigate(`/photos?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleTopicClick = (topic) => {
    console.log('🎯 Topic clicked:', topic);
    // Для тем используем поиск, а не SET_TOPIC
    handleSearch(topic);
  };

  const handleCollectionClick = (collectionTitle) => {
    console.log('📚 Collection clicked:', collectionTitle);
    handleSearch(collectionTitle);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The internet's source for visuals
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Powered by creators everywhere.
          </p>

          <div className="max-w-2xl mx-auto">
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center text-gray-400">
                <span className="text-lg mr-3">🔍</span>
                <span className="text-gray-500 text-lg">Search photos and illustrations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-16 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured</h2>
          <FeaturedTopics onTopicClick={handleTopicClick} />
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Collections</h2>
          <CollectionsCarousel onCollectionClick={handleCollectionClick} />
        </div>
      </section>

      {/* Photos Grid */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Photos</h2>
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