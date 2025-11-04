import {useRef, useEffect} from 'react';
import PhotoCard from './PhotoCard';

export default function PhotosGrid({photos, isLoading, onLoadMore, hasMore}) {
  const loaderRef = useRef();

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      {threshold: 1}
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Photos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo}/>
        ))}
        {isLoading && photos.length === 0 &&
          [...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))
        }
      </div>

      {hasMore && (
        <div ref={loaderRef} className="mt-6 flex justify-center">
          <div
            className="loader border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}
    </section>
  );
}
