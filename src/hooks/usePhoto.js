import {useReducer, useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {photosReducer, initialState} from '../redux/reducers/photos.js';
import Service from "../API/api.js";
import LoginService from "../API/login.js";

export function usePhotos() {
  const [state, dispatch] = useReducer(photosReducer, initialState);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Проверяем токен и получаем юзера
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
        localStorage.removeItem('token');
        navigate('/');
      }
    })();
  }, []);

  // 📌 Универсальный загрузчик
  const loadPhotos = useCallback(async (pageNum = 1, reset = false) => {
    dispatch({type: 'LOAD_START'});
    try {
      let data = [];

      // Если выбрана коллекция — она главнее всего
      if (state.activeCollection) {
        data = await Service.getCollectionPhotos(state.activeCollection, pageNum, 20);
      } else {
        data = await Service.getPhotosAll({
          page: pageNum,
          perPage: 20,
          query: state.query,
          topic: state.topic,
          color: state.selectedColor,
          orientation: state.orientation
        });
      }

      dispatch({type: 'LOAD_SUCCESS', payload: data, reset});
    } catch (error) {
      console.error("Error loading photos:", error);
      dispatch({type: 'LOAD_SUCCESS', payload: [], reset});
    }
  }, [state.query, state.selectedColor, state.activeCollection, state.orientation, state.topic]);

  // Загружаем при изменении фильтров
  useEffect(() => {
    loadPhotos(1, true);
  }, [state.selectedColor, state.query, state.activeCollection, state.orientation, state.topic, loadPhotos]);

  // Загружаем коллекции (для UI)
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

  // Поиск с debounce
  const handleSearch = (q) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      dispatch({type: 'SET_QUERY', payload: q});
    }, 500);
  };

  // Загрузка следующей страницы
  const handleLoadMore = () => {
    if (!state.isLoadingPhotos && state.hasMore) {
      dispatch({type: 'NEXT_PAGE'});
      loadPhotos(state.page + 1);
    }
  };

  useEffect(() => {
    return () => searchTimeoutRef.current && clearTimeout(searchTimeoutRef.current);
  }, []);

  return {state, dispatch, handleSearch, handleLoadMore};
}
