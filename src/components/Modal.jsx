// components/Modal.jsx
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/reducers/favorites";
import Star from '../assets/icons/Star.svg?react';
import Download from '../assets/icons/download.svg?react';

export default function Modal({ isOpen, onClose, photo, photos = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    const index = photos.findIndex(p => p.id === photo.id);
    setSelectedIndex(Math.max(0, index));
  }, [photo, photos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

  const currentPhoto = photos[selectedIndex] || photo;
  const isFav = favorites.some((f) => f.id === currentPhoto.id);

  const handleNext = () => {
    if (selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleDownload = () => {
    window.open(currentPhoto.links.download, '_blank');
  };

  const handleFavorite = () => {
    dispatch(toggleFavorite(currentPhoto));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <NavLink
            to={`/user/${currentPhoto.user.username}`}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.user.profile_image.medium}
              alt={currentPhoto.user.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm">{currentPhoto.user.name}</p>
              <p className="text-xs text-gray-500">@{currentPhoto.user.username}</p>
            </div>
          </NavLink>

          <div className="flex items-center space-x-3">
            {/* Кнопка избранного */}
            <button
              onClick={handleFavorite}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Star
                className="w-4 h-4"
                fill={isFav ? '#f9a603' : 'transparent'}
                stroke={isFav ? '#f9a603' : 'currentColor'}
                strokeWidth="2"
              />
              <span className={`text-sm ${isFav ? 'text-[#f9a603]' : 'text-gray-700'}`}>
                {isFav ? currentPhoto.likes + 1 : currentPhoto.likes}
              </span>
            </button>

            {/* Кнопка скачивания */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </button>

            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Изображение */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 min-h-0">
            <div className="relative max-w-full max-h-full">
              <img
                src={currentPhoto.urls.regular}
                alt={currentPhoto.description || currentPhoto.alt_description}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />

              {/* Навигационные стрелки */}
              {photos.length > 1 && (
                <>
                  {selectedIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      ←
                    </button>
                  )}
                  {selectedIndex < photos.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      →
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Информация */}
          <div className="md:w-80 lg:w-96 p-6 border-l bg-white overflow-y-auto">
            {/* Описание */}
            {currentPhoto.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{currentPhoto.description}</p>
              </div>
            )}

            {/* Информация о фото */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Dimensions</h4>
                <p className="text-gray-900">{currentPhoto.width} × {currentPhoto.height}</p>
              </div>

              {currentPhoto.exif?.make && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Camera</h4>
                  <p className="text-gray-900">{currentPhoto.exif.make} {currentPhoto.exif.model}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Published</h4>
                <p className="text-gray-900">
                  {new Date(currentPhoto.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Теги */}
              {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPhoto.tags.slice(0, 8).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Дополнительные действия */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex space-x-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download</span>
                </button>

                <button
                  onClick={handleFavorite}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Star
                    className="w-4 h-4"
                    fill={isFav ? '#f9a603' : 'transparent'}
                    stroke={isFav ? '#f9a603' : 'currentColor'}
                  />
                  <span className={`text-sm font-medium ${isFav ? 'text-[#f9a603]' : 'text-gray-700'}`}>
                    {isFav ? 'Liked' : 'Like'}
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