import axios from 'axios';

const loginApi = axios.create({
  baseURL: 'https://dummyjson.com'
})

class LoginService {
  static async login(username, password) {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const localUser = registeredUsers.find(user => user.username === username);

      if (localUser) {
        return localUser;
      }

      const {data: authData} = await loginApi.post(`/auth/login`, {
        username,
        password
      });

      const {data: userData} = await loginApi.get(`/users/${authData.id}`);

      return {
        ...authData,
        ...userData
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async getUserInfo(token) {
    if (!token) throw new Error("No token provided");

    if (token.startsWith('mock-token-') || token.startsWith('mock-access-token-')) {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.token === token || u.accessToken === token);
      if (user) return user;
      throw new Error("User not found");
    }

    try {
      const {data} = await loginApi.get("/auth/me", {
        headers: {Authorization: `Bearer ${token}`}
      });
      return data;
    } catch (error) {
      console.error("Get user info error:", error);
      throw error;
    }
  }

  static async updateUser(userId, token, updateData) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      const updatedUser = {
        ...registeredUsers[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      registeredUsers[userIndex] = updatedUser;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id === userId) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return updatedUser;
    } else {
      try {
        const {data} = await loginApi.put(`/users/${userId}`, updateData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        return data;
      } catch (error) {
        console.error("Update user error:", error);
        throw error;
      }
    }
  }

  static async deleteUser(userId, token) {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.id === userId);

      if (userIndex !== -1) {
        registeredUsers.splice(userIndex, 1);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id === userId) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }

        return {message: "User deleted successfully"};
      } else {
        const {data} = await loginApi.delete(`/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return data;
      }
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  }

  static async getAllUsers(token, limit = 30, skip = 0) {
    try {
      const {data} = await loginApi.get(`/users?limit=${limit}&skip=${skip}`, {
        headers: {Authorization: `Bearer ${token}`}
      });

      const usersWithRole = data.users.map(user => ({
        ...user,
        role: user.role || 'user'
      }));

      return {...data, users: usersWithRole};
    } catch (error) {
      console.error("Get all users error:", error);
      throw error;
    }
  }

  static async updateUserRole(userId, token, newRole) {
    try {
      const {data} = await loginApi.put(`/users/${userId}`, {
        role: newRole
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return data;
    } catch (error) {
      console.error("Update user role error:", error);
      throw error;
    }
  }
}

export default LoginService;