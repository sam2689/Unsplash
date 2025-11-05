// components/SearchWithFilters.jsx (ОБНОВЛЕННЫЙ)
import {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import { usePhotos } from "../hooks/usePhoto";
import ColorFilters from './ColorFilters.jsx';
import Service from "../API/api.js";
import OrientationFilters from './OrientationFields.jsx';
import TopicsFilters from './TopicFilters.jsx';
import SearchModal from './SearchModal.jsx';
import FilterCarousel from './FilterCarousel.jsx';

export default function SearchWithFilters({ logo, onSearch }) {
  const { state, dispatch } = usePhotos();

  const [localQuery, setLocalQuery] = useState(state.query || '');
  const [collections, setCollections] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Синхронизируем localQuery с state.query
  useEffect(() => {
    setLocalQuery(state.query || '');
  }, [state.query]);

  useEffect(() => {
    (async () => {
      try {
        const data = await Service.getCollections(5);
        setCollections(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
  };

  const handleLocalSearch = (searchQuery = localQuery) => {
    if (searchQuery.trim()) {
      // Комбинируем основной запрос с фильтрами
      const fullQuery = activeFilters.length > 0
        ? `${searchQuery} ${activeFilters.join(' ')}`
        : searchQuery;

      // Используем переданную функцию поиска
      onSearch(fullQuery);
      setActiveFilters([]);
    }
  };

  const handleFilterSelect = (filter) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter];

      // Автоматически выполняем поиск с выбранным фильтром
      if (localQuery.trim()) {
        const fullQuery = newFilters.length > 0
          ? `${localQuery} ${newFilters.join(' ')}`
          : localQuery;
        onSearch(fullQuery);
      }

      return newFilters;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLocalSearch();
      setIsSearchModalOpen(false);
    }
  };

  return (
    <>
      <section className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center mb-4">
              {logo}
              <h1 className="text-3xl font-bold ml-2">Unsplash</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Beautiful, free photos gifted by the world's most generous community of photographers.
            </p>
            <div className="max-w-md space-y-4">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search photos"
                value={localQuery}
                onChange={handleInputChange}
                onFocus={() => setIsSearchModalOpen(true)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
              />

              {/* Карусель фильтров */}
              <FilterCarousel
                searchTerm={localQuery}
                onFilterSelect={handleFilterSelect}
                activeFilters={activeFilters}
              />

              {/* Существующие фильтры */}
              <ColorFilters
                selectedColor={state.selectedColor}
                onChange={(color) => dispatch({type: 'SET_COLOR', payload: color})}
                disabled={!localQuery.trim()}
              />

              <OrientationFilters
                selectedOrientation={state.orientation}
                onChange={(v) => dispatch({type: 'SET_ORIENTATION', payload: v})}
              />

              <TopicsFilters
                selectedTopic={state.topic}
                onChange={(v) => dispatch({type: 'SET_TOPIC', payload: v})}
              />

            </div>
          </div>

          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-2">
              {collections.map(c => (
                <NavLink
                  key={c.id}
                  to={`/collections/${c.id}`}
                  className="relative overflow-hidden rounded-lg"
                >
                  <img
                    src={c.cover_photo?.urls.small}
                    alt={c.title}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                    {c.title}
                  </div>
                </NavLink>
              ))}
              <NavLink
                to="/collections"
                className="flex items-center justify-center bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300"
              >
                See more
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно поиска */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={(term) => {
          setLocalQuery(term);
          onSearch(term);
        }}
        currentQuery={localQuery}
      />
    </>
  );
}