// import {useEffect, useState} from "react";
// import {useSelector} from "react-redux";
// import LoginService from "../API/login.js";
// import Loader from "../components/Loader.jsx";
// import ConfirmModal from '../components/ConfirmModal.jsx'
// import {toast} from "react-toastify";
// import { useTheme } from '../hooks/useTheme';
//
// export default function AdminPanel() {
//   const currentUser = useSelector(state => state.auth.user);
//   const token = useSelector(state => state.auth.token);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const [updatingUsers, setUpdatingUsers] = useState({});
//   const { isDark } = useTheme();
//
//   useEffect(() => {
//     if (currentUser?.role === 'admin') {
//       (async () => {
//         setLoading(true);
//         try {
//           const data = await LoginService.getAllUsers(token);
//           const usersWithRole = data.users.map(user => ({
//             ...user,
//             role: user.role || 'user'
//           }));
//           setUsers(usersWithRole);
//           toast.success("Users loaded successfully");
//         } catch (error) {
//           console.error("Error fetching users:", error);
//           toast.error("Failed to fetch users");
//         }
//         setLoading(false);
//       })()
//     }
//   }, [currentUser, token]);
//
//   const handleDeleteClick = (userId) => {
//     setUserToDelete(userId);
//     setIsModalOpen(true);
//   };
//
//   const handleConfirmDelete = async () => {
//     setIsModalOpen(false);
//     setLoading(true);
//
//     try {
//       await LoginService.deleteUser(userToDelete, token);
//       setUsers(users.filter(user => user.id !== userToDelete));
//       toast.success("User deleted successfully");
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       toast.error("Failed to delete user");
//     } finally {
//       setLoading(false);
//       setUserToDelete(null);
//     }
//   };
//
//   const handleCancelDelete = () => {
//     setIsModalOpen(false);
//     setUserToDelete(null);
//   };
//
//   const handleRoleChange = async (userId, newRole) => {
//     setUpdatingUsers(prev => ({...prev, [userId]: true}));
//
//     try {
//       await LoginService.updateUserRole(userId, token, newRole);
//       setUsers(users.map(user =>
//         user.id === userId ? {...user, role: newRole} : user
//       ));
//       toast.success("User role updated successfully");
//     } catch (error) {
//       console.error("Error updating user role:", error);
//       toast.error("Failed to update user role");
//     } finally {
//       setUpdatingUsers(prev => ({...prev, [userId]: false}));
//     }
//   };
//
//   if (currentUser?.role !== 'admin') {
//     return (
//       <div className={`max-w-md mx-auto mt-8 p-6 rounded shadow text-center transition-colors duration-300 ${
//         isDark
//           ? 'bg-gray-800 text-white'
//           : 'bg-white text-gray-900'
//       }`}>
//         <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
//         <p>You need administrator privileges to access this page.</p>
//       </div>
//     );
//   }
//
//   if (loading) {
//     return <Loader/>;
//   }
//
//   return (
//     <div className={`container mx-auto mt-8 p-4 transition-colors duration-300 ${
//       isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
//     }`}>
//       <h2 className="text-2xl font-bold mb-4">Admin Panel - User Management</h2>
//
//       <div className="overflow-x-auto">
//         <table className={`min-w-full border transition-colors duration-300 ${
//           isDark
//             ? 'bg-gray-800 border-gray-700'
//             : 'bg-white border-gray-200'
//         }`}>
//           <thead>
//           <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
//             <th className="px-4 py-2 border-b">ID</th>
//             <th className="px-4 py-2 border-b">Avatar</th>
//             <th className="px-4 py-2 border-b">Username</th>
//             <th className="px-4 py-2 border-b">Email</th>
//             <th className="px-4 py-2 border-b">Name</th>
//             <th className="px-4 py-2 border-b">Role</th>
//             <th className="px-4 py-2 border-b">Actions</th>
//           </tr>
//           </thead>
//           <tbody>
//           {users.map(user => (
//             <tr key={user.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
//               <td className="px-4 py-2 border-b">{user.id}</td>
//               <td className="px-4 py-2 border-b">
//                 <img
//                   src={user.image}
//                   alt={user.username}
//                   className="w-10 h-10 rounded-full"
//                 />
//               </td>
//               <td className="px-4 py-2 border-b">{user.username}</td>
//               <td className="px-4 py-2 border-b">{user.email}</td>
//               <td className="px-4 py-2 border-b">{user.firstName} {user.lastName}</td>
//               <td className="px-4 py-2 border-b">
//                 {updatingUsers[user.id] ? (
//                   <div className="flex justify-center">
//                     <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
//                   </div>
//                 ) : (
//                   <select
//                     value={user.role || 'user'}
//                     onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                     className={`border rounded p-1 ${
//                       isDark
//                         ? 'bg-gray-700 border-gray-600 text-white'
//                         : 'border-gray-300'
//                     }`}
//                     disabled={updatingUsers[user.id]}
//                   >
//                     <option value="user">User</option>
//                     <option value="moderator">Moderator</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 )}
//               </td>
//               <td className="px-4 py-2 border-b">
//                 <button
//                   onClick={() => handleDeleteClick(user.id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
//                   disabled={updatingUsers[user.id]}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//           </tbody>
//         </table>
//       </div>
//
//       <ConfirmModal
//         isOpen={isModalOpen}
//         onConfirm={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//         message="Are you sure you want to delete this user?"
//       />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoginService from "../API/login.js";
import Loader from "../components/Loader.jsx";
import ConfirmModal from '../components/ConfirmModal.jsx';
import { toast } from "react-toastify";
import { useTheme } from '../hooks/useTheme';

export default function AdminPanel() {
  const currentUser = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updatingUsers, setUpdatingUsers] = useState({});
  const { isDark } = useTheme();

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
      })();
    }
  }, [currentUser, token]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    setLoading(true);

    try {
      await LoginService.deleteUser(userToDelete.id, token);
      setUsers(users.filter(user => user.id !== userToDelete.id));
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

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      moderator: 'bg-blue-100 text-blue-800 border-blue-200',
      user: 'bg-green-100 text-green-800 border-green-200'
    };

    const darkColors = {
      admin: 'bg-red-900/30 text-red-300 border-red-700',
      moderator: 'bg-blue-900/30 text-blue-300 border-blue-700',
      user: 'bg-green-900/30 text-green-300 border-green-700'
    };

    return isDark ? darkColors[role] : colors[role];
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className={`max-w-md mx-auto mt-8 p-8 rounded-2xl shadow-lg text-center transition-all duration-300 ${
        isDark
          ? 'bg-gray-800 text-white border border-gray-700'
          : 'bg-white text-gray-900 border border-gray-200'
      }`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🚫</span>
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">You need administrator privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`mb-8 p-6 rounded-2xl shadow-sm border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage user roles and permissions
              </p>
            </div>
            <div className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <span className="text-sm font-medium">Total Users: {users.length}</span>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid gap-6">
          {users.map(user => (
            <div
              key={user.id}
              className={`group p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* User Avatar & Basic Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <img
                      src={user.image}
                      alt={user.username}
                      className="w-16 h-16 rounded-2xl border-2 border-gray-300 dark:border-gray-600"
                    />
                    {updatingUsers[user.id] && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{user.username}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Role Selector */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Role:
                    </label>
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`border rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      } ${updatingUsers[user.id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={updatingUsers[user.id]}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      updatingUsers[user.id]
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    disabled={updatingUsers[user.id]}
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* User ID */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  User ID: {user.id}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${
            isDark ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no users to display at the moment.
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={`Are you sure you want to delete user "${userToDelete?.username}"? This action cannot be undone.`}
      />
    </div>
  );
}