import {useState, useEffect, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Service from '../API/api.js';
import PhotosGrid from '../components/PhotosGrid.jsx';
import Logo from '../assets/icons/logo.svg?react';

export default function CollectionDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    photos: [],
    isLoading: true,
    page: 1,
    hasMore: true,
  });

  const loadPhotos = useCallback(async (pageNum = 1) => {
    setState(prev => ({...prev, isLoading: true}));

    try {
      const data = await Service.getCollectionPhotos(id, pageNum, 20);
      setState(prev => ({
        ...prev,
        photos: pageNum === 1 ? data : [...prev.photos, ...data],
        hasMore: data.length > 0,
        isLoading: false,
      }));
    } catch (e) {
      console.error(e);
      setState(prev => ({...prev, isLoading: false}));
    }
  }, [id]);

  useEffect(() => {
    setState({
      photos: [],
      isLoading: true,
      page: 1,
      hasMore: true,
    });
    loadPhotos(1);
  }, [id, loadPhotos]);

  const handleLoadMore = () => {
    if (!state.isLoading && state.hasMore) {
      const nextPage = state.page + 1;
      setState(prev => ({...prev, page: nextPage}));
      loadPhotos(nextPage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/home')}>
            <Logo/>
          </button>
          <h1 className="text-3xl font-bold mx-4">Collection Photos</h1>
        </div>
        <PhotosGrid
          photos={state.photos}
          isLoading={state.isLoading}
          onLoadMore={handleLoadMore}
          hasMore={state.hasMore}
        />
      </div>
    </div>
  );
}
