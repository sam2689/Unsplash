import HeroSection from "../components/HeroSection.jsx";
import PhotosGrid from "../components/PhotosGrid.jsx";
import Logo from '../assets/icons/logo.svg?react';
import {usePhotos} from "../hooks/usePhoto";
import {useEffect} from "react";
import {store} from "../redux/store.js";

export default function Home() {
  const {state, dispatch, handleSearch, handleLoadMore} = usePhotos();

  useEffect(() => {
    const handleBeforeUnload = () => {
      const state = store.getState();
      if (state.auth.user) {
        localStorage.setItem('user', JSON.stringify(state.auth.user));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        onSearch={handleSearch}
        selectedColor={state.selectedColor}
        onColorChange={(color) => dispatch({type: 'SET_COLOR', payload: color})}
        selectedOrientation={state.orientation}
        onOrientationChange={(v) => dispatch({type: 'SET_ORIENTATION', payload: v})}
        selectedTopic={state.topic}
        onTopicChange={(v) => dispatch({type: 'SET_TOPIC', payload: v})}
        collections={state.collections}
        onCollectionClick={(id) => dispatch({type: 'SET_ACTIVE_COLLECTION', payload: id})}
        logo={<Logo/>}
      />

      <PhotosGrid
        photos={state.photos}
        isLoading={state.isLoadingPhotos}
        onLoadMore={handleLoadMore}
        hasMore={state.hasMore}
      />
    </div>
  );
}
