// components/CollectionsCarousel.jsx
import React, { useState, useEffect } from 'react';
import Service from '../API/api.js';

const CollectionsCarousel = ({ onCollectionClick }) => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    return <div className="flex space-x-4 overflow-hidden">Loading collections...</div>;
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
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
            className="relative rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <img
              src={collection.cover_photo?.urls.regular}
              alt={collection.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">{collection.title}</h3>
              <p className="text-gray-200 text-sm">{collection.total_photos} photos</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectionsCarousel;