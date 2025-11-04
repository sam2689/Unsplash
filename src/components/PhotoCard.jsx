import {useState} from 'react';
import Modal from './Modal';

export default function PhotoCard({photo, allPhotos}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="cursor-pointer group relative"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="overflow-hidden rounded-lg">
          <img
            src={photo.urls.small}
            alt={photo.description || 'Unsplash photo'}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"/>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm truncate">{photo.user.name}</p>
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
