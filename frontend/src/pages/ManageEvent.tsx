import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function ManageEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event || response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEventDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      const response = await api.delete(`/events/${id}`);
      if (response.data.success) {
        alert("Event deleted successfully");
        navigate('/dashboard');
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500 animate-pulse">Loading management console...</div>;
  if (!event) return <div className="flex justify-center items-center min-h-screen text-gray-500">Event not found.</div>;

  const rsvpCount = event.rsvps?.length || event._count?.rsvps || 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">Manage Event</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 line-clamp-1">{event.title}</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link to={`/edit-event/${event.id}`} className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-center">
              Edit Details
            </Link>
            <button onClick={handleDelete} className="flex-1 sm:flex-none px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
            <p className="text-3xl font-extrabold text-gray-900">{rsvpCount} <span className="text-lg text-gray-400 font-medium">/ {event.seatLimit}</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Date & Time</p>
            <p className="text-lg font-bold text-gray-900">{new Date(event.date).toLocaleDateString()} {event.time && `• ${event.time}`}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Venue</p>
            <p className="text-lg font-bold text-gray-900 truncate">{event.venue}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Registered Attendees</h3>
          </div>
          
          {event.rsvps && event.rsvps.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {event.rsvps.map((rsvp: any) => (
                    <tr key={rsvp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {rsvp.user?.name || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {rsvp.user?.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(rsvp.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No one has registered for this event yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}