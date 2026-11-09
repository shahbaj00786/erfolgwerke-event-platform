import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { exportEventsToCSV } from '../services/csvService';

const StatCard = ({ title, value, icon, subtitle }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
    <div className="text-4xl bg-blue-50 p-4 rounded-xl">{icon}</div>
  </div>
);

export default function OrganizerData() {
  const [events, setEvents] = useState<any[]>([]);

  const [stats, setStats] = useState({ total: 0, bookings: 0, capacity: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/events/my-events');
        const eventData = response.data.events || response.data || [];
        setEvents(Array.isArray(eventData) ? eventData : []);

        if (Array.isArray(eventData) && eventData.length > 0) {
          let bookings = 0;
          let capacity = 0;
          eventData.forEach((event: any) => {
            bookings += Number(event._count?.rsvps || event.rsvps?.length || 0);
            capacity += Number(event.seatLimit || 0);
          });
          setStats({ total: eventData.length, bookings, capacity });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500 animate-pulse font-medium">Loading analytics...</div>;

  const occupancyRate = stats.capacity > 0 ? Math.round((stats.bookings / stats.capacity) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Track your event performance and audience reach.</p>
        </div>

        {/* CSV */}
       <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => exportEventsToCSV(events)}
          className="hover:cursor-pointer flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Export CSV
        </button>
      </div> 


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Events" value={stats.total} icon="📅" subtitle="Hosted so far" />
          <StatCard title="Total Tickets Booked" value={stats.bookings} icon="🎟️" subtitle="Across all events" />
          <StatCard title="Total Capacity" value={stats.capacity} icon="🏢" subtitle="Total seats available" />
          <StatCard title="Occupancy Rate" value={`${occupancyRate}%`} icon="📈" subtitle="Average fill rate" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Event Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Event Name</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.length > 0 ? events.map((event: any) => {
                  const rsvps = event._count?.rsvps || event.rsvps?.length || 0;
                  return (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        <Link to={`/manage-event/${event.id}`} className="hover:text-blue-600 transition-colors">
                          {event.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                        {rsvps} / <span className="text-gray-500">{event.seatLimit}</span>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No events data available yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}