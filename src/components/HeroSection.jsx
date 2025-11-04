import {useEffect, useState} from 'react';
import ColorFilters from './ColorFilters.jsx';
import Service from "../API/api.js";
import {NavLink} from 'react-router-dom';

export default function HeroSection({onSearch, selectedColor, onColorChange, logo}) {
  const [query, setQuery] = useState('');
  const [collections, setCollections] = useState([]);

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
    setQuery(value);
    onSearch(value);
  };

  return (
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
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search photos"
              value={query}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ColorFilters selectedColor={selectedColor} onChange={onColorChange} disabled={!query.trim()} />
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
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
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
  );
}
