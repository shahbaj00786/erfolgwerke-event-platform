import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { token, userRole, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🎟️</span>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 tracking-tight">
                Erfolgwerke
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {!token ? (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-md transition-all duration-200 active:scale-95 hidden sm:block"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {userRole === 'ORGANIZER' ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/organizer-data" 
                      className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hidden sm:block"
                    >
                      Analytics
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/my-rsvps" 
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    My Tickets
                  </Link>
                )}
                
                <div className="h-6 w-px bg-gray-200 mx-1"></div> 
                
                <button 
                  onClick={handleLogout}
                  className="hover:cursor-pointer px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}