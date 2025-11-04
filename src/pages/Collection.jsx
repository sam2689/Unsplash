import {useState, useEffect} from 'react';
import {Link, NavLink} from 'react-router-dom';
import Service from '../API/api.js';
import Logo from '../assets/icons/logo.svg?react'
import Loader from "../components/Loader.jsx";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <NavLink to={'/home'}
          >
            <Logo/>
          </NavLink>
          <h1 className="text-3xl font-bold mx-4">Collections</h1>
        </div>

        {isLoading ? (
          <Loader/>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map(c => (
              <Link
                to={`/collections/${c.id}`}
                key={c.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={c.cover_photo?.urls.small || ''}
                  alt={c.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h2 className="font-medium text-gray-900">{c.title}</h2>
                  <p className="text-sm text-gray-500">{c.total_photos} photos</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
