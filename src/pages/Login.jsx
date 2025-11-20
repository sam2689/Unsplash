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

      // ВАЖНО: Сначала диспатчим успешный логин, потом настройку избранного
      dispatch(loginSuccess({
        user: data,
        token: data.accessToken || data.token
      }));

      // Загружаем избранное для этого пользователя
      dispatch(setUserFavorites(data.id));

      navigate('/home', {replace: true});
    } catch (err) {
      setState(prev => ({...prev, loginError: 'Invalid username or password'}));
    }
    setState(prev => ({...prev, loading: false}));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your Unsplash account</p>
          </div>

          {state.loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {state.loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={state.formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  state.errors.username
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your username"
              />
              {state.errors.username && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {state.errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={state.showPassword ? "text" : "password"}
                  name="password"
                  value={state.formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-12 ${
                    state.errors.password
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setState(prev => ({...prev, showPassword: !prev.showPassword}))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {state.showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {state.errors.password && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {state.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {state.loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          <div className="text-center mt-4">
            <NavLink
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Forgot your password?
            </NavLink>
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <NavLink
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;