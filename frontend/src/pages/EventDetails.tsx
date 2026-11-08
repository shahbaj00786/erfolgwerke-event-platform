import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAppContext } from '../context/AppContext';
import { useRsvp } from '../hooks/useRsvp';

export default function EventDetails() {
  const { id } = useParams();
  const { userRole, user } = useAppContext();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event || response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchEvent();
  }, [fetchEvent, id]);

  const { handleRsvp: originalRsvp } = useRsvp(fetchEvent);

  const handleRsvpClick = async () => {
    await originalRsvp(event.id);
    const currentUserId = user?.id || (user as any)?.userId;
    setEvent((prev: any) => ({
      ...prev,
      rsvps: [...(prev.rsvps || []), { userId: currentUserId }]
    }));
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500 animate-pulse">Loading event details...</div>;
  if (!event) return <div className="flex justify-center items-center min-h-screen text-gray-500">Event not found.</div>;

  const formattedDate = new Date(event.date).toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const rsvpCount = event._count?.rsvps || event.rsvps?.length || 0;
  const isSoldOut = rsvpCount >= event.seatLimit;

  let currentUserId = user?.id || (user as any)?.userId;
  if (!currentUserId) {
    try {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsed = JSON.parse(localUser);
        currentUserId = parsed.id || parsed.userId;
      }
    } catch (e) {}
  }

  const isRegistered = event.rsvps?.some((rsvp: any) => {
    const rsvpUid = rsvp.userId || rsvp.user?.id;
    return currentUserId ? String(rsvpUid) === String(currentUserId) : false;
  });


  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl text-gray-700 text-sm font-medium">
                  <span>📅</span> {formattedDate}
                </div>
                {event.time && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl text-gray-700 text-sm font-medium">
                    <span>⏰</span> {event.time}
                  </div>
                )}
                <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl text-gray-700 text-sm font-medium">
                  <span>📍</span> {event.venue}
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 bg-gray-50 p-5 rounded-xl border border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-700">Availability</span>
                <span className="text-sm font-extrabold text-gray-900">{rsvpCount} / {event.seatLimit} <span className="text-xs text-gray-500 font-normal">seats</span></span>
              </div>

              {userRole === 'ORGANIZER' ? (
                <Link 
                  to={`/manage-event/${event.id}`} 
                  className="block w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors text-center text-sm"
                >
                  Manage Event
                </Link>
              ) : isRegistered ? (
                <button
                  disabled
                  className="w-full py-3 font-bold rounded-xl transition-all duration-200 bg-green-50 text-green-700 border border-green-200 cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  <span>✅</span> Registered
                </button>
              ) : (
                <button
                  onClick={handleRsvpClick}
                  disabled={isSoldOut}
                  className={`hover:cursor-pointer w-full py-3 font-bold rounded-xl transition-all duration-200 text-sm ${
                    isSoldOut
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  }`}
                >
                  {isSoldOut ? 'Sold Out' : 'RSVP Now'}
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">About this Event</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}