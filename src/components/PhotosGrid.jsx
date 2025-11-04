import { useRef, useEffect } from 'react';
import PhotoCard from './PhotoCard';

export default function PhotosGrid({ photos, isLoading, onLoadMore, hasMore }) {
  const loaderRef = useRef();

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <section className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}

        {isLoading && photos.length === 0 &&
          [...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg shadow-md"></div>
            </div>
          ))
        }
      </div>

      {hasMore && (
        <div ref={loaderRef} className="mt-6 flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
}
