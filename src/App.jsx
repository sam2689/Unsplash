import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import User from "./pages/User.jsx";
import CollectionDetailPage from "./pages/CollectionDetails.jsx";
import CollectionsPage from "./pages/Collection.jsx";
import Login from "./pages/Login.jsx";
import FavoritesPage from "./pages/Favorites.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Register from "./pages/Register.jsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {restoreAuth} from "./redux/reducers/auth.js";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import DeleteAccount from "./pages/DeleteAccount.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

function App() {
  const dispatch = useDispatch();

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
        } else {
          console.error("Invalid user data in localStorage");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      if (userData === "undefined" || userData === "null") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>

      <main className='flex-1'>
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
        </Routes>
      </main>
    </div>

  );
}

export default App;