// components/FilterCarousel.jsx
import React from 'react';

const FilterCarousel = ({ searchTerm, onFilterSelect, activeFilters = [] }) => {
  // Фильтры для разных категорий
  const filterCategories = {
    car: ['BMW', 'Porsche', 'Lamborghini', 'Mercedes', 'Ferrari', 'Sports Car', 'Classic Car', 'SUV'],
    nature: ['Forest', 'Mountain', 'Beach', 'Sunset', 'Wildlife', 'Flowers', 'Ocean', 'Sky'],
    wallpaper: ['HD Wallpaper', 'Phone Wallpaper', 'Desktop Wallpaper', 'Abstract', 'Minimal'],
    architecture: ['Modern', 'Classical', 'Interior', 'Building', 'Bridge', 'City'],
    travel: ['Landscape', 'Cityscape', 'Adventure', 'Culture', 'Beach'],
    animals: ['Wildlife', 'Pets', 'Birds', 'Marine', 'Forest Animals']
  };

  const getFiltersForTerm = (term) => {
    if (!term) return [];

    const normalizedTerm = term.toLowerCase();
    for (const [category, filters] of Object.entries(filterCategories)) {
      if (normalizedTerm.includes(category)) {
        return filters;
      }
    }

    // Если нет точного совпадения, возвращаем общие фильтры
    return ['HD Wallpaper', 'Background', 'High Quality', 'Professional'];
  };

  const currentFilters = getFiltersForTerm(searchTerm);

  if (currentFilters.length === 0 || !searchTerm) return null;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-sm text-gray-500 whitespace-nowrap">Refine by:</span>
          {currentFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => onFilterSelect(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilters.includes(filter)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterCarousel;