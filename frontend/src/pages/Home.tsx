import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  date: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then((response) => {
        const fetchedEvents = Array.isArray(response.data) 
          ? response.data 
          : response.data.events || response.data.data || [];
        setEvents(fetchedEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  // RSVP API Call
  const handleRsvp = async (eventId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("RSVP karne ke liye pehle login karein.");
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/rsvps/create',
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("RSVP Successful!");
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "RSVP failed.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Events</h1>
        
        {userRole === 'ORGANIZER' && (
          <Link to="/create-event" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
            + Create Event
          </Link>
        )}
      </div>
      
      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(events) && events.map((event) => (
            <div key={event.id} className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{event.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(event.date).toLocaleDateString()}
              </p>
              
              {userRole === 'ORGANIZER' ? (
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Manage Event
                </button>
              ) : (
                <button 
                  onClick={() => handleRsvp(event.id)} 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  RSVP
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}