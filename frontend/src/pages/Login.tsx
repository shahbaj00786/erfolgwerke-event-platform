import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ATTENDEE'); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { 
          email, 
          password 
        });
        localStorage.setItem('token', res.data.token); 
        localStorage.setItem('role', res.data.user?.role || res.data.role || 'ATTENDEE'); 
        navigate('/'); 
      } else {
        await axios.post('http://localhost:5000/api/auth/signup', { 
          name,
          email, 
          password,
          role 
        });
        alert('Signup Successful! Please login to continue.');
        setIsLogin(true); 
        setPassword('');  
      }
    } catch (error) {
      console.error(error);
      alert(isLogin ? 'Login failed. Email ya password check karein.' : 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center mt-20 px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {isLogin ? 'Login' : 'Create an Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">I am an:</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role"
                      value="ATTENDEE" // Updated here
                      checked={role === 'ATTENDEE'}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Attendee</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role"
                      value="ORGANIZER"
                      checked={role === 'ORGANIZER'}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Organizer</span>
                  </label>
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors mt-2 hover:cursor-pointer">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setRole('ATTENDEE'); 
            }} 
            className="text-blue-600 font-medium hover:underline focus:outline-none hover:cursor-pointer">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
        
      </div>
    </div>
  );
}