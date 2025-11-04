import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/reducers/favorites";
import Star from '../assets/icons/Star.svg?react';
import Download from '../assets/icons/download.svg?react';

export default function Modal({ isOpen, onClose, photo, photos = [] }) {
  const currentIndex = photos.findIndex(p => p.id === photo.id);
  const [selectedIndex, setSelectedIndex] = useState(currentIndex);

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    setSelectedIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onEsc);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

  const currentPhoto = photos[selectedIndex] || photo;
  const isFav = favorites.some((f) => f.id === currentPhoto.id);

  const handleSelectPhoto = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <NavLink
            to={`/user/${currentPhoto.user.username}`}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src={currentPhoto.user.profile_image.medium}
              alt={currentPhoto.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{currentPhoto.user.name}</p>
              <p className="text-sm text-gray-600">@{currentPhoto.user.username}</p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light p-2"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 flex justify-center items-center p-4">
              <img
                src={currentPhoto.urls.regular}
                alt={currentPhoto.description || currentPhoto.alt_description}
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="md:w-1/3 p-6 border-l">
              {currentPhoto.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900">{currentPhoto.description}</p>
                </div>
              )}

              {currentPhoto.location && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-gray-900">{currentPhoto.location}</p>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Dimensions</h3>
                <p className="text-gray-900">{currentPhoto.width} × {currentPhoto.height}</p>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-4">
                <a
                  href={currentPhoto.links.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5"/>
                </a>

                <button
                  onClick={() => dispatch(toggleFavorite(currentPhoto))}
                  className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Star
                    className="w-5 h-5 mr-1"
                    fill={isFav ? '#f9a603' : 'transparent'}
                  />
                  <span className={`${isFav ? 'text-[#f9a603]' : 'text-gray-600'}`}>
                    {isFav ? currentPhoto.likes + 1 : currentPhoto.likes}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
