// components/PhotoCard.jsx
import {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/reducers/favorites";
import Modal from './Modal';
import Star from '../assets/icons/Star.svg?react';
import Download from '../assets/icons/download.svg?react';

export default function PhotoCard({photo, allPhotos}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const isFav = favorites.some((f) => f.id === photo.id);

  const handleDownload = (e) => {
    e.stopPropagation();
    window.open(photo.links.download, '_blank');
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(photo));
  };

  return (
    <>
      <div
        className="cursor-pointer group relative w-full mb-6"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div className="overflow-hidden rounded-lg bg-gray-100 relative">
          <img
            src={photo.urls.small}
            alt={photo.description || 'Unsplash photo'}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            style={{
              minHeight: '200px',
              maxHeight: '500px'
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

          {/* Кнопки поверх картинки */}
          <div className={`absolute top-3 right-3 flex space-x-2 transition-all duration-300 ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button
              onClick={handleFavorite}
              className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              title="Add to favorites"
            >
              <Star
                className="w-4 h-4"
                fill={isFav ? '#f9a603' : 'transparent'}
                stroke={isFav ? '#f9a603' : 'currentColor'}
                strokeWidth="2"
              />
            </button>

            <button
              onClick={handleDownload}
              className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Информация о пользователе внизу */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={photo.user.profile_image.small}
                  alt={photo.user.name}
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-white text-sm font-medium truncate">{photo.user.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleFavorite}
                  className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
                >
                  <Star
                    className="w-3 h-3"
                    fill={isFav ? '#f9a603' : 'transparent'}
                    stroke={isFav ? '#f9a603' : 'currentColor'}
                  />
                  <span className="text-xs">{photo.likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        photo={photo}
        photos={allPhotos}
      />
    </>
  );
}