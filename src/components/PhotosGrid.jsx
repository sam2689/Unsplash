import { useRef, useEffect } from 'react';
import Masonry from 'react-masonry-css';
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

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <section className="p-6">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-6 w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {photos.map((photo) => (
          <div key={photo.id} className="mb-6">
            <PhotoCard photo={photo} />
          </div>
        ))}

        {isLoading && photos.length === 0 &&
          [...Array(12)].map((_, i) => (
            <div key={i} className="mb-6 animate-pulse">
              <div
                className="bg-gray-200 rounded-lg shadow-md"
                style={{
                  height: `${200 + (i % 4) * 100}px`
                }}
              ></div>
            </div>
          ))
        }
      </Masonry>

      {hasMore && (
        <div ref={loaderRef} className="mt-6 flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
}