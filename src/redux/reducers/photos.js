export const initialState = {
  photos: [],
  isLoadingPhotos: true,
  page: 1,
  selectedColor: '',
  hasMore: true,
  query: '',
  collections: [],
  activeCollection: null,
  user: null,
};

export function photosReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {...state, user: action.payload};

    case 'SET_COLLECTIONS':
      return {...state, collections: action.payload};

    case 'SET_QUERY':
      return {...state, query: action.payload, page: 1, activeCollection: null};

    case 'SET_COLOR':
      return {...state, selectedColor: action.payload, page: 1};

    case 'SET_ACTIVE_COLLECTION':
      return {...state, activeCollection: action.payload, query: '', page: 1};

    case 'LOAD_START':
      return {...state, isLoadingPhotos: true};

    case 'LOAD_SUCCESS':
      return {
        ...state,
        photos: action.reset ? action.payload : mergeUnique(state.photos, action.payload),
        isLoadingPhotos: false,
        hasMore: action.payload.length > 0,
      };

    case 'NEXT_PAGE':
      return {...state, page: state.page + 1};

    default:
      return state;
  }
}

function mergeUnique(existing, incoming) {
  const all = [...existing, ...incoming];
  return Array.from(new Map(all.map(p => [p.id, p])).values());
}
