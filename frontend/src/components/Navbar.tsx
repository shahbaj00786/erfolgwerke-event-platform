import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toUpperCase(); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Erfolgwerke
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Events
            </Link>
            
            {token ? (
              <>
                {role === 'ATTENDEE' && (
                  <Link to="/my-rsvps" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    My RSVPs
                  </Link>
                )}
                
                {role === 'ORGANIZER' && (
                  <Link to="/create-event" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Create Event
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}