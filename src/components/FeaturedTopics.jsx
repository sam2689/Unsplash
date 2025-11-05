// components/FeaturedTopics.jsx
import React from 'react';

const FeaturedTopics = ({ onTopicClick }) => {
  const topics = [
    { name: 'Wallpapers', count: '1.2M', searchTerm: 'wallpaper' },
    { name: '3D Renders', count: '432K', searchTerm: '3d' },
    { name: 'Nature', count: '845K', searchTerm: 'nature' },
    { name: 'Textures', count: '218K', searchTerm: 'texture' },
    { name: 'Film', count: '156K', searchTerm: 'film' },
    { name: 'Architecture', count: '654K', searchTerm: 'architecture' },
    { name: 'Street Photography', count: '387K', searchTerm: 'street photography' },
    { name: 'Experimental', count: '98K', searchTerm: 'experimental' },
    { name: 'Travel', count: '1.1M', searchTerm: 'travel' },
    { name: 'People', count: '2.3M', searchTerm: 'people' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {topics.map((topic, index) => (
        <div
          key={index}
          onClick={() => onTopicClick(topic.searchTerm)} // Передаем searchTerm, а не name
          className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
        >
          <h3 className="font-semibold text-gray-900 text-lg mb-2">{topic.name}</h3>
          <p className="text-gray-500 text-sm">{topic.count} photos</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedTopics;