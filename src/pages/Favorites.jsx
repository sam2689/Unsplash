import { useSelector } from "react-redux";
import PhotosGrid from "../components/PhotosGrid";
import { useTheme } from '../hooks/useTheme';

export default function FavoritesPage() {
  const favorites = useSelector((state) => state.favorites.items);
  const currentUserId = useSelector((state) => state.favorites.currentUserId);
  const { isDark } = useTheme();

  if (!currentUserId) {
    return (
      <div className={`p-6 min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Please log in to view your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <h2 className={`text-2xl font-bold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Your Favorite Photos</h2>

      {favorites.length > 0 ? (
        <PhotosGrid photos={favorites}/>
      ) : (
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          You haven't added anything to your favorites yet.
        </p>
      )}
    </div>
  );
}