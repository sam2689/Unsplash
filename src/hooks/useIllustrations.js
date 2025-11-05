// hooks/useIllustrations.js
import {useReducer, useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {photosReducer, initialState} from '../redux/reducers/photos.js';
import Service from "../API/api.js";
import LoginService from "../API/login.js";

export function useIllustrations() {
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

  // 📌 Загрузчик для иллюстраций
  const loadIllustrations = useCallback(async (pageNum = 1, reset = false) => {
    dispatch({type: 'LOAD_START'});
    try {
      let data = [];

      // Для иллюстраций всегда добавляем "illustration" к запросу
      let searchQuery = state.query;
      if (searchQuery && !searchQuery.includes('illustration')) {
        searchQuery = `${searchQuery} illustration`;
      }

      data = await Service.getPhotosAll({
        page: pageNum,
        perPage: 20,
        query: searchQuery || 'illustration', // По умолчанию ищем иллюстрации
        topic: state.topic,
        color: state.selectedColor,
        orientation: state.orientation
      });

      dispatch({type: 'LOAD_SUCCESS', payload: data, reset});
    } catch (error) {
      console.error("Error loading illustrations:", error);
      dispatch({type: 'LOAD_SUCCESS', payload: [], reset});
    }
  }, [state.query, state.selectedColor, state.orientation, state.topic]);

  // Загружаем при изменении фильтров
  useEffect(() => {
    loadIllustrations(1, true);
  }, [state.selectedColor, state.query, state.orientation, state.topic, loadIllustrations]);

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
      loadIllustrations(state.page + 1, false);
    }
  };

  useEffect(() => {
    return () => searchTimeoutRef.current && clearTimeout(searchTimeoutRef.current);
  }, []);

  return {state, dispatch, handleSearch, handleLoadMore};
}