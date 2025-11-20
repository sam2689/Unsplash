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

  static async requestPasswordReset(email) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.email === email);

      if (!user) {
        throw new Error('User with this email not found');
      }

      const resetToken = `reset-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
      resetRequests.push({
        email,
        token: resetToken,
        expiresAt: Date.now() + 3600000,
        used: false
      });
      localStorage.setItem('passwordResetRequests', JSON.stringify(resetRequests));

      console.log(`Password reset link: http://yourapp.com/reset-password?token=${resetToken}`);

      return {
        success: true,
        message: 'Password reset instructions sent to your email',
        demoToken: resetToken
      };
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
      const resetRequest = resetRequests.find(req => req.token === token && !req.used);

      if (!resetRequest) {
        throw new Error('Invalid or expired reset token');
      }

      if (Date.now() > resetRequest.expiresAt) {
        throw new Error('Reset token has expired');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.email === resetRequest.email);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      registeredUsers[userIndex].password = newPassword;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      resetRequest.used = true;
      localStorage.setItem('passwordResetRequests', JSON.stringify(resetRequests));

      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  static validateResetToken(token) {
    const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
    const resetRequest = resetRequests.find(req => req.token === token && !req.used);

    if (!resetRequest) {
      return {valid: false, message: 'Invalid or expired reset token'};
    }

    if (Date.now() > resetRequest.expiresAt) {
      return {valid: false, message: 'Reset token has expired'};
    }

    return {valid: true, email: resetRequest.email};
  }
}

export default LoginService;