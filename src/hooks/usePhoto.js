import {useReducer, useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {photosReducer, initialState} from '../redux/reducers/photos.js';
import Service from "../API/api.js";
import LoginService from "../API/login.js";

export function usePhotos() {
  const [state, dispatch] = useReducer(photosReducer, initialState);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    (async () => {
      try {
        const userData = await LoginService.getUserInfo(token);
        dispatch({type: 'SET_USER', payload: userData});
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem('token');
        navigate('/');
      }
    })();
  }, []);

  const loadPhotos = useCallback(async (pageNum = 1, reset = false) => {
    dispatch({type: 'LOAD_START'});
    try {
      let data = [];
      if (state.activeCollection) {
        data = await Service.getCollectionPhotos(state.activeCollection, pageNum, 20);
      } else if (state.query) {
        data = await Service.searchPhotos(state.query, pageNum, 20, state.selectedColor || '');
      } else {
        data = await Service.getPhotos(pageNum, 20, state.selectedColor || '');
      }
      dispatch({type: 'LOAD_SUCCESS', payload: data, reset});
    } catch (error) {
      console.error("Error loading photos:", error);
      dispatch({type: 'LOAD_SUCCESS', payload: [], reset});
    }
  }, [state.query, state.selectedColor, state.activeCollection]);

  useEffect(() => {
    loadPhotos(1, true);
  }, [state.selectedColor, state.query, state.activeCollection, loadPhotos]);

  useEffect(() => {
    (async () => {
      try {
        const data = await Service.getCollections(1, 5);
        dispatch({type: 'SET_COLLECTIONS', payload: data});
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSearch = (q) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      dispatch({type: 'SET_QUERY', payload: q});
    }, 500);
  };

  const handleLoadMore = () => {
    if (!state.isLoadingPhotos && state.hasMore) {
      dispatch({type: 'NEXT_PAGE'});
      loadPhotos(state.page + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return {state, dispatch, handleSearch, handleLoadMore};
}
