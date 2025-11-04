import {useSelector} from "react-redux";
import PhotosGrid from "../components/PhotosGrid";

export default function FavoritesPage() {
  const favorites = useSelector((state) => state.favorites.items);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Featured Photos</h2>

      {favorites.length > 0 ? (
        <PhotosGrid photos={favorites}/>
      ) : (
        <p className="text-gray-600"> You haven't added anything to your favorites yet.</p>
      )}
    </div>
  );
}
