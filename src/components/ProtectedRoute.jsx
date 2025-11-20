import {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import LoginService from '../API/login.js';
import LoaderOverlay from './Loader';

export default function ProtectedRoute({children}) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuth(false);
        return <Navigate to={'/'} replace={true} />;
      }

      try {
        await LoginService.getUserInfo(token);
        setIsAuth(true);
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuth(false);
      }
    })();

  }, []);

  return (
    <>
      {children}
      {isAuth === null && <LoaderOverlay/>}
      {isAuth === false && <Navigate to="/" replace/>}
    </>
  );
}
