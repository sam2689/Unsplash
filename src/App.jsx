import {Routes, Route, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import User from "./pages/User.jsx";
import CollectionDetailPage from "./pages/CollectionDetails.jsx";
import CollectionsPage from "./pages/Collection.jsx";
import Login from "./pages/Login.jsx";
import FavoritesPage from "./pages/Favorites.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Register from "./pages/Register.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {restoreAuth} from "./redux/reducers/auth.js";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import DeleteAccount from "./pages/DeleteAccount.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Photos from './pages/Photos';
import Illustrations from "./pages/Illustrations.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import {setUserFavorites} from "./redux/reducers/favorites.js";
import { useTheme } from './hooks/useTheme';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const { isDark } = useTheme();

  const publicRoutes = ['/', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showSidebar = user && !isPublicRoute;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined" && userData !== "null") {
      try {
        const user = JSON.parse(userData);
        if (user && (user.id || user.username)) {
          dispatch(restoreAuth({
            user: user,
            token: token
          }));
          dispatch(setUserFavorites(user.id));
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar/>}

      <main className={`${showSidebar ? 'flex-1' : 'w-full'} overflow-auto transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          }/>
          <Route path="/register" element={
            <PublicRoute>
              <Register/>
            </PublicRoute>
          }/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword />}/>

          <Route path="/home" element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }/>
          <Route path="/favorites" element={
            <ProtectedRoute>
              <FavoritesPage/>
            </ProtectedRoute>
          }/>
          <Route path="/user/:username" element={
            <ProtectedRoute>
              <User/>
            </ProtectedRoute>
          }/>
          <Route path="/collections" element={
            <ProtectedRoute>
              <CollectionsPage/>
            </ProtectedRoute>
          }/>
          <Route path="/collections/:id" element={
            <ProtectedRoute>
              <CollectionDetailPage/>
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }/>
          <Route path="/edit-profile" element={
            <ProtectedRoute>
              <EditProfile/>
            </ProtectedRoute>
          }/>
          <Route path="/delete-account" element={
            <ProtectedRoute>
              <DeleteAccount/>
            </ProtectedRoute>
          }/>
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel/>
            </ProtectedRoute>
          }/>
          <Route path="/photos" element={
            <ProtectedRoute>
              <Photos/>
            </ProtectedRoute>
          }/>
          <Route path="/illustrations" element={
            <ProtectedRoute>
              <Illustrations />
            </ProtectedRoute>
          }/>
        </Routes>
      </main>
    </div>
  );
}

export default App;