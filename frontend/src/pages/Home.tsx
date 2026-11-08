import { useState, useEffect, useCallback } from 'react';
import EventCard from '../components/EventCard';
import api from '../services/api';
import { useRsvp } from '../hooks/useRsvp';
import { useAppContext } from '../context/AppContext'; 

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAppContext(); 

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events || response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const { handleRsvp } = useRsvp(fetchEvents);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Discover & Book <span className="text-blue-600">Amazing Events</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Find the best tech summits, workshops, and meetups happening around you.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 animate-pulse text-lg font-medium">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No events found. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map((event) => {
              const isRegistered = event.rsvps?.some(
                (rsvp: any) => rsvp.userId === user?.id || rsvp.user?.id === user?.id
              );

              return (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  userRole={userRole} 
                  isRegistered={isRegistered} 
                  onRsvp={handleRsvp} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}