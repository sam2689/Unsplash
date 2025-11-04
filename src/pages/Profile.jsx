import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import LoginService from "../API/login.js";
import Loader from "../components/Loader.jsx";
import {NavLink} from "react-router-dom";

export default function Profile() {
  const token = useSelector(state => state.auth.token);
  const userData = useSelector(state => state.auth.user);
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && userData.id) {
      setUser(userData);
      return;
    }

    if (token && (!userData || !userData.id)) {
      setLoading(true);
      (async () => {
        try {
          const data = await LoginService.getUserInfo(token);
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
          setLoading(false);
      })();
    }
  }, [token, userData]);

  if (loading) return <Loader/>;

  if (!user) return <div className="text-center mt-8">User data not available</div>;

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      {user.image && (
        <img
          src={user.image}
          alt={user.username}
          className="w-24 h-24 rounded-full mx-auto"
        />
      )}
      <h2 className="text-xl font-bold text-center mt-2">
        {user.firstName} {user.lastName}
      </h2>
      <p className="text-center text-gray-600">Username:@{user.username}</p>
      <p className="text-center text-gray-600">User Email:{user.email}</p>
      {user.phone && (
        <p className="text-center text-gray-600">User Phone:{user.phone}</p>
      )}
      {user.birthDate && (
        <p className="text-center text-gray-600">User Birth Date:{user.birthDate}</p>
      )}

      <NavLink
        to="/edit-profile"
        className="block mt-4 text-center bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        Edit Profile
      </NavLink>
      <NavLink
        to="/delete-account"
        className="block mt-4 text-center bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition"
      >
        Delete Account
      </NavLink>
    </div>
  );
}