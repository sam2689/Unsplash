import { useReducer, useCallback } from 'react';
import { photosReducer, initialState } from '../redux/reducers/photos';
import Service from '../API/api';

export function useCollections() {
  const [state, dispatch] = useReducer(photosReducer, initialState);

  const fetchCollections = useCallback(async (query = '', page = 1) => {
    dispatch({ type: 'LOAD_START' });
    try {
      let data = [];
      if (query.trim()) {
        data = await Service.searchCollections(query, page, 20);
      } else {
        data = await Service.getCollections(page, 20);
      }
      dispatch({ type: 'SET_COLLECTIONS_SEARCH', payload: data });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'LOAD_SUCCESS', payload: [] });
    }
  }, []);

  return { state, fetchCollections };
}
