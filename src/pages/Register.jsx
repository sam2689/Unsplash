import {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../redux/reducers/auth";


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
      errors: {},
      registerError: ""
    }));
  };

  const validate = () => {
    const errs = {};
    if (!state.formData.username.trim()) errs.username = "Username required";
    if (!state.formData.password || state.formData.password.length < 6) errs.password = "Password min 6 chars";
    if (!state.formData.email.trim()) errs.email = "Email required";
    if (!state.formData.firstName.trim()) errs.firstName = "First name required";
    if (!state.formData.lastName.trim()) errs.lastName = "Last name required";

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

      navigate("/home", {replace: true});
    } catch (err) {
      console.error("Registration error:", err);
      setState(prev => ({...prev, registerError: "Registration failed. Please try again."}));
    }
      setState(prev => ({...prev, loading: false}));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {state.registerError && <div className="text-red-600 mb-2 text-sm">{state.registerError}</div>}

        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
            Username
          </label>
          <input name="username" value={state.formData.username} onChange={handleChange}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                   state.errors.username
                     ? 'border-red-500 focus:ring-red-400'
                     : 'border-gray-300 focus:ring-blue-400'
                 }`}/>
          {state.errors.username && <div className="text-red-500 text-xs">{state.errors.username}</div>}
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
            Email
          </label>
          <input name="email" type="email" value={state.formData.email} onChange={handleChange}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                   state.errors.username
                     ? 'border-red-500 focus:ring-red-400'
                     : 'border-gray-300 focus:ring-blue-400'
                 }`}/>
          {state.errors.email && <div className="text-red-500 text-xs">{state.errors.email}</div>}
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            name="password"
            type={state.showPassword ? "text" : "password"}
            value={state.formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              state.errors.username
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}/>

          <button
            type="button"
            onClick={() => setState(prev => ({...prev, showPassword: !prev.showPassword}))}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {state.showPassword ? "🙈" : "👁️"}
          </button>
          {state.errors.password && <div className="text-red-500 text-xs">{state.errors.password}</div>}
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
            First Name
          </label>
          <input name="firstName" value={state.formData.firstName} onChange={handleChange}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                   state.errors.username
                     ? 'border-red-500 focus:ring-red-400'
                     : 'border-gray-300 focus:ring-blue-400'
                 }`}/>
          {state.errors.firstName && <div className="text-red-500 text-xs">{state.errors.firstName}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
            Last Name
          </label>
          <input name="lastName" value={state.formData.lastName} onChange={handleChange}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                   state.errors.username
                     ? 'border-red-500 focus:ring-red-400'
                     : 'border-gray-300 focus:ring-blue-400'
                 }`}/>
          {state.errors.lastName && <div className="text-red-500 text-xs">{state.errors.lastName}</div>}
        </div>

        <button type="submit" disabled={state.loading}
                className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-blue-300">
          {state.loading ? "Loading..." : "Register"}
        </button>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <NavLink
            to="/"
            className="text-blue-500 hover:underline"
          >
            Login
          </NavLink>
        </div>
      </form>
    </div>
  );
}

