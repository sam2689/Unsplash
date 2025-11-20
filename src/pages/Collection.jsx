import {useState, useEffect} from 'react';
import {Link, NavLink} from 'react-router-dom';
import Service from '../API/api.js';
import Logo from '../assets/icons/logo.svg?react'
import Loader from "../components/Loader.jsx";
import { useTheme } from '../hooks/useTheme';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await Service.getCollections(30, 20);
        setCollections(data);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <NavLink to={'/home'}>
            <Logo className={isDark ? 'text-white' : 'text-gray-900'}/>
          </NavLink>
          <h1 className={`text-3xl font-bold mx-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Collections</h1>
        </div>

        {isLoading ? (
          <Loader/>
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
              >
                <img
                  src={c.cover_photo?.urls.small || ''}
                  alt={c.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h2 className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{c.title}</h2>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{c.total_photos} photos</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}