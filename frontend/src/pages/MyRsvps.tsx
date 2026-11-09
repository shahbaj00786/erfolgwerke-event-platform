import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import api from '../services/api';

export default function MyRsvps() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRsvps();
  }, []);

  const fetchMyRsvps = async () => {
    try {
      const response = await api.get('/rsvps/my-rsvps'); 
      const fetchedData = response.data.rsvps || response.data;
      
      const eventList = fetchedData.map((item: any) => ({
        ...(item.event ? item.event : item),
        rsvpId: item.id
      }));
      
      setEvents(eventList);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRsvp = async (rsvpId: number) => {
    if (!window.confirm("Are you sure you want to cancel your ticket for this event?")) return;
    
    try {
      const response = await api.delete(`/rsvps/${rsvpId}`);
      
      if (response.data.success) {
        alert("Ticket cancelled successfully.");
        fetchMyRsvps(); 
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error: any) {
      alert("Failed to cancel ticket: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              My Registrations
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              All the amazing events you have RSVP'd to.
            </p>
          </div>
          
          <Link 
            to="/" 
            className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 text-center"
          >
            Explore More Events
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-lg font-medium text-gray-500 animate-pulse">Loading your tickets...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-5xl mb-4 block">🎟️</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No RSVPs yet</h3>
            <p className="text-gray-500 mb-6">You haven't registered for any events yet. Don't miss out!</p>
            <Link 
              to="/" 
              className="inline-block px-6 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Discover Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard 
                key={event.rsvpId || index} 
                event={event} 
                userRole="ATTENDEE" 
                onCancel={handleCancelRsvp} 
              />
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}