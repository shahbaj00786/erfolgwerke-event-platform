import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import MyRsvps from './pages/MyRsvps';
import MyEvents from './pages/MyEvents';
import CreateEvent from './pages/CreateEvent';
import ManageEvent from './pages/ManageEvent';
import EditEvent from './pages/EditEvent';
import Footer from './components/Footer';
import { AppProvider } from './context/AppContext';
import EventDetails from './pages/EventDetails';
import OrganizerData from './pages/OrganizerDashboard';


const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />

          {/* Protected Routes  */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-rsvps" element={<MyRsvps />} />
            <Route path="/dashboard" element={<MyEvents />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/organizer-data" element={<OrganizerData />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/manage-event/:id" element={<ManageEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;