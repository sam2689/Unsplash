import React, { useState, useEffect } from 'react';
import Service from '../API/api.js';
import { useTheme } from '../hooks/useTheme';

const CollectionsCarousel = ({ onCollectionClick }) => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const data = await Service.getCollections(1, 8);
        setCollections(data);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex space-x-4 overflow-hidden ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Loading collections...
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        {collections.map(collection => (
          <div
            key={collection.id}
            className="flex-shrink-0 w-80 group"
          >
            <div
              onClick={() => {
                console.log('📸 Collection clicked:', collection.title);
                onCollectionClick(collection.title);
              }}
              className={`relative rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isDark ? 'hover:shadow-2xl hover:shadow-purple-500/20' : ''
              }`}
            >
              <img
                src={collection.cover_photo?.urls.regular}
                alt={collection.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">{collection.title}</h3>
                <p className="text-gray-200 text-sm">{collection.total_photos} photos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-white to-transparent dark:from-gray-900 pointer-events-none" />
    </div>
  );
};

export default CollectionsCarousel;