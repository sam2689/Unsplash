import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/reducers/appSettings';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.appSettings.theme);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (theme) => dispatch(setTheme(theme))
  };
};