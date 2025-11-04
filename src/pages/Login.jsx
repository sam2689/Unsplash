import {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {loginSuccess} from "../redux/reducers/auth";
import LoginService from "../API/login.js";
import Logo from '../assets/icons/logo.svg?react'
import {setUserFavorites} from "../redux/reducers/favorites.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    formData: {
      username: localStorage.getItem('username') || '',
      password: '',
    },
    errors: {},
    loginError: '',
    loading: false,
    showPassword: false,
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setState(prev => ({
      ...prev,
      formData: {...prev.formData, [name]: value},
      errors: {...prev.errors, [name]: ''},
      loginError: '',
    }));
  };

  const validate = () => {
    const errs = {};

    if (!state.formData.username.trim()) {
      errs.username = 'Username is required';
    } else if (/\s/.test(state.formData.username)) {
      errs.username = 'Username cannot contain spaces';
    }

    if (!state.formData.password.trim()) {
      errs.password = 'Password is required';
    } else if (state.formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setState(prev => ({...prev, errors: errs}));
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setState(prev => ({...prev, loading: true}));
    try {
      const data = await LoginService.login(
        state.formData.username,
        state.formData.password
      );

      console.log("LOGIN RESPONSE:", data.id);

      localStorage.setItem('token', data.accessToken || data.token);
      localStorage.setItem('user', JSON.stringify(data));

      dispatch(loginSuccess({
        user: data,
        token: data.accessToken || data.token
      }));
      dispatch(setUserFavorites(data.id));

      navigate('/home', {replace: true});
    } catch (err) {
      setState(prev => ({...prev, loginError: 'Invalid username or password'}));
    }
    setState(prev => ({...prev, loading: false}));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm "
      >
        <div className="flex justify-center mb-4">
          <Logo className="w-16 h-16"/>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {state.loginError && (
          <div className="mb-4 text-red-600 text-sm font-medium">{state.loginError}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={state.formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              state.errors.username
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {state.errors.username && (
            <p className="text-red-500 text-xs mt-1">{state.errors.username}</p>
          )}
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type={state.showPassword ? "text" : "password"}
            name="password"
            value={state.formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
              state.errors.password
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}
          />

          <button
            type="button"
            onClick={() => setState(prev => ({...prev, showPassword: !prev.showPassword}))}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {state.showPassword ? "🙈" : "👁️"}
          </button>

          {state.errors.password && (
            <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300 transition"
        >
          {state.loading ? 'Loading...' : 'Login'}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <NavLink
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Register
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Login;
