import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ATTENDEE'); 

  const navigate = useNavigate();
  const location = useLocation();
  const { login, setUser } = useAppContext(); 

  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup'; 
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password, role };

      const response = await api.post(endpoint, payload);

      if (response.data.success || response.data.token) {
        const userRole = (response.data.user?.role || response.data.role || role).toUpperCase();
        
        login(response.data.token, userRole, response.data.user);
        
        if (response.data.user) {
          setUser(response.data.user);
        }
        
        if (userRole === 'ORGANIZER') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        alert(response.data.message || 'Authentication failed');
      }
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin ? 'Please enter your details to sign in.' : 'Join us to discover and manage events.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">I want to...</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="hover:cursor-pointer w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700"
              >
                <option value="ATTENDEE">Attend Events</option>
                <option value="ORGANIZER">Organize Events</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className=" hover:cursor-pointer w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-200 active:scale-[0.98] mt-2"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="hover:cursor-pointer font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
}
