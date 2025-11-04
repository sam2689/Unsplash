import {useState, useEffect} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import Service from '../API/api';
import PhotosGrid from '../components/PhotosGrid';

export default function User() {
  const {username} = useParams();
  const [state, setState] = useState({
    user: {},
    userPhotos: [],
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const userData = await Service.getUser(username);
        const photosData = await Service.getUserPhotos(username);

        setState({
          user: userData,
          userPhotos: photosData,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setState(prev => ({...prev, isLoading: false}));
      }
    })();
  }, [username]);

  if (state.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NavLink to="/home" className="text-blue-500 mb-4 inline-block">
        ← Back
      </NavLink>

      <div className="flex items-center space-x-6 mb-8">
        <img
          src={state.user.profile_image.large}
          alt={state.user.name}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{state.user.name}</h1>
          <p className="text-gray-600">@{state.user.username}</p>
          {state.user.bio && <p className="mt-2 text-gray-800">{state.user.bio}</p>}

          <div className="flex space-x-4 mt-3">
            <div>
              <span className="font-bold">{state.user.total_photos}</span>
              <span className="text-gray-600 ml-1">Photos</span>
            </div>
            <div>
              <span className="font-bold">{state.user.followers_count}</span>
              <span className="text-gray-600 ml-1">Followers</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Photos</h2>
      <PhotosGrid photos={state.userPhotos} isLoading={false}/>
    </div>
  );
}
