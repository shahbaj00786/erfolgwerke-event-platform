import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import api from '../services/api';

export default function MyEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get('/events/my-events');
        setEvents(response.data.events || response.data);
      } catch (error) {
        console.error("Error fetching my events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Organizer Dashboard</h1>
            <p className="text-sm text-gray-500 mt-2">Manage all the events you are hosting.</p>
          </div>
          <Link to="/create-event" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            + Create New Event
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 animate-pulse font-medium">Loading your events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-5xl mb-4 block">📅</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500 mb-6">You haven't created any events. Start hosting today!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} userRole="ORGANIZER" />
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}