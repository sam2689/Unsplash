import {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../redux/reducers/auth";
import Logo from '../assets/icons/logo.svg?react'
import {setUserFavorites} from "../redux/reducers/favorites.js";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    formData: {username: "", password: "", email: "", firstName: "", lastName: ""},
    errors: {},
    loading: false,
    registerError: "",
    showPassword: false
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setState(prev => ({
      ...prev,
      formData: {...prev.formData, [name]: value},
      errors: {...prev.errors, [name]: ""},
      registerError: ""
    }));
  };

  const validate = () => {
    const errs = {};
    if (!state.formData.username.trim()) errs.username = "Username is required";
    if (!state.formData.password || state.formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!state.formData.email.trim()) errs.email = "Email is required";
    if (!state.formData.firstName.trim()) errs.firstName = "First name is required";
    if (!state.formData.lastName.trim()) errs.lastName = "Last name is required";

    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existingUsers.find(user => user.username === state.formData.username)) {
      errs.username = "Username already taken";
    }

    setState(prev => ({...prev, errors: errs}));
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setState(prev => ({...prev, loading: true}));

    try {
      const mockUser = {
        id: Date.now(),
        username: state.formData.username,
        email: state.formData.email,
        firstName: state.formData.firstName,
        lastName: state.formData.lastName,
        image: `https://robohash.org/${state.formData.username}`,
        token: `mock-token-${Date.now()}`,
        accessToken: `mock-access-token-${Date.now()}`,
      };

      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, mockUser]));

      localStorage.setItem('token', mockUser.accessToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      dispatch(loginSuccess({
        user: mockUser,
        token: mockUser.accessToken
      }));
      dispatch(setUserFavorites(mockUser.id))

      navigate("/home", {replace: true});
    } catch (err) {
      console.error("Registration error:", err);
      setState(prev => ({...prev, registerError: "Registration failed. Please try again."}));
    }
    setState(prev => ({...prev, loading: false}));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Unsplash</h1>
            <p className="text-gray-600">Create your free account</p>
          </div>

          {state.registerError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {state.registerError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={state.formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                    state.errors.firstName
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="John"
                />
                {state.errors.firstName && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <span className="mr-1">⚠</span>
                    {state.errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={state.formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                    state.errors.lastName
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Doe"
                />
                {state.errors.lastName && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <span className="mr-1">⚠</span>
                    {state.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={state.formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                  state.errors.email
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="john@example.com"
              />
              {state.errors.email && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                name="username"
                value={state.formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                  state.errors.username
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="johndoe"
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
                  name="password"
                  type={state.showPassword ? "text" : "password"}
                  value={state.formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition pr-12 ${
                    state.errors.password
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="At least 6 characters"
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
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              {state.loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <NavLink
              to="/"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Sign in
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}