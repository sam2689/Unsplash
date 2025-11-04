import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import LoginService from "../API/login.js";
import Loader from "../components/Loader.jsx";
import ConfirmModal from '../components/ConfirmModal.jsx'
import {toast} from "react-toastify";

export default function AdminPanel() {
  const currentUser = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updatingUsers, setUpdatingUsers] = useState({});

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      (async () => {
        setLoading(true);
        try {
          const data = await LoginService.getAllUsers(token);
          const usersWithRole = data.users.map(user => ({
            ...user,
            role: user.role || 'user'
          }));
          setUsers(usersWithRole);
          toast.success("Users loaded successfully");
        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to fetch users");
        }
        setLoading(false);
      })()
    }
  }, [currentUser, token]);

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    setLoading(true);

    try {
      await LoginService.deleteUser(userToDelete, token);
      setUsers(users.filter(user => user.id !== userToDelete));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUsers(prev => ({...prev, [userId]: true}));

    try {
      await LoginService.updateUserRole(userId, token, newRole);
      setUsers(users.map(user =>
        user.id === userId ? {...user, role: newRole} : user
      ));
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdatingUsers(prev => ({...prev, [userId]: false}));
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p>You need administrator privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - User Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Avatar</th>
            <th className="px-4 py-2 border-b">Username</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Role</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
          </thead>
          <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{user.id}</td>
              <td className="px-4 py-2 border-b">
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="px-4 py-2 border-b">{user.username}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">{user.firstName} {user.lastName}</td>
              <td className="px-4 py-2 border-b">
                {updatingUsers[user.id] ? (
                  <div className="flex justify-center">
                    <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded p-1"
                    disabled={updatingUsers[user.id]}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleDeleteClick(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                  disabled={updatingUsers[user.id]}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
}