import {useReducer, useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {photosReducer, initialState} from '../redux/reducers/photos.js';
import Service from "../API/api.js";
import LoginService from "../API/login.js";

export function useIllustrations() {
  const [state, dispatch] = useReducer(photosReducer, initialState);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Используем useRef для стабильных зависимостей
  const stateRef = useRef(state);
  stateRef.current = state;

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
  }, [navigate]);

  const loadIllustrations = useCallback(async (pageNum = 1, reset = false) => {
    dispatch({type: 'LOAD_START'});
    try {
      let searchQuery = stateRef.current.query;

      // Добавляем "illustration" к запросу если его нет
      if (searchQuery && !searchQuery.includes('illustration')) {
        searchQuery = `${searchQuery} illustration`;
      } else if (!searchQuery) {
        searchQuery = 'illustration';
      }

      const data = await Service.getPhotosAll({
        page: pageNum,
        perPage: 20,
        query: searchQuery,
        topic: stateRef.current.topic,
        color: stateRef.current.selectedColor,
        orientation: stateRef.current.orientation
      });

      dispatch({type: 'LOAD_SUCCESS', payload: data, reset});
    } catch (error) {
      console.error("Error loading illustrations:", error);
      dispatch({type: 'LOAD_SUCCESS', payload: [], reset});
    }
  }, []); // Убрали зависимости, используем stateRef

  // Дебаунс для поиска
  const handleSearch = useCallback((q) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      dispatch({type: 'SET_QUERY', payload: q});
    }, 500);
  }, []);

  // Функция для изменения цвета
  const handleColorChange = useCallback((color) => {
    dispatch({type: 'SET_COLOR', payload: color});
  }, []);

  // Функция для сброса фильтров
  const handleResetFilters = useCallback(() => {
    dispatch({type: 'SET_COLOR', payload: ''});
    dispatch({type: 'SET_ORIENTATION', payload: ''});
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!state.isLoadingPhotos && state.hasMore) {
      dispatch({type: 'NEXT_PAGE'});
      loadIllustrations(state.page + 1, false);
    }
  }, [state.isLoadingPhotos, state.hasMore, state.page, loadIllustrations]);

  // Загрузка данных при изменении фильтров
  useEffect(() => {
    loadIllustrations(1, true);
  }, [
    state.query,
    state.selectedColor,
    state.orientation,
    state.topic,
    loadIllustrations
  ]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return {
    state,
    dispatch,
    handleSearch,
    handleLoadMore,
    handleColorChange, // Добавляем функцию для изменения цвета
    handleResetFilters // Добавляем функцию для сброса фильтров
  };
}