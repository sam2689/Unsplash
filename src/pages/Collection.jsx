import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Service from '../API/api.js';
import Logo from '../assets/icons/logo.svg?react';
import Loader from "../components/Loader.jsx";
import SearchModal from "../components/SearchModal.jsx";
import { useTheme } from '../hooks/useTheme';
import Search from '../assets/icons/Search.svg?react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const fetchCollections = async (query = '') => {
    setIsLoading(true);
    try {
      let data = [];
      if (query.trim()) {
        data = await Service.searchCollections(query, 1, 30);
      } else {
        data = await Service.getCollections(1, 30);
      }
      setCollections(data);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      fetchCollections(searchTerm);
      setIsSearchModalOpen(false);
    }
  };

  const handleCollectionClick = (collectionTitle) => {
    fetchCollections(collectionTitle);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>

      {/* Hero Banner */}
      <section className={`relative py-20 px-6 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-orange-800 to-red-900'
          : 'bg-gradient-to-br from-orange-100 to-pink-200'
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <NavLink to={'/home'}>
              <Logo className={isDark ? 'text-white' : 'text-gray-900'} />
            </NavLink>
          </div>
          <h1 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Explore Collections
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Curated sets of photos and illustrations from creators worldwide.
          </p>

          {/* Search Trigger */}
          <div className="max-w-2xl mx-auto">
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className={`rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 group ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Search className={`w-6 h-6 mr-3 transition-colors duration-300 ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                <span className={`text-lg transition-colors duration-300 ${
                  isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
                }`}>
            Search collections
          </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Collections Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Collections</h2>

          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collections.map(c => (
                <Link
                  to={`/collections/${c.id}`}
                  key={c.id}
                  className={`rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      : 'border border-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => handleCollectionClick(c.title)}
                >
                  <img
                    src={c.cover_photo?.urls.small || ''}
                    alt={c.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h2 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{c.title}</h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{c.total_photos} photos</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
        currentQuery=""
      />
    </div>
  );
}
