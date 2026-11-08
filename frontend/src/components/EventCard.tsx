import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    venue: string;
    seatLimit: number;
    _count?: { rsvps: number };
  };
  userRole: string | null;
  onRsvp?: (id: number) => void;
}

export default function EventCard({ event, userRole, onRsvp }: EventCardProps) {
  const rsvpCount = event._count?.rsvps || 0;
  const isSoldOut = rsvpCount >= event.seatLimit;

  const formattedDate = new Date(event.date).toLocaleDateString(undefined, { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      
      <Link to={`/event/${event.id}`} className="p-6 block flex-grow cursor-pointer group">
        <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h2>
        
        <div className="space-y-3 mb-5">
          <p className="text-sm text-gray-600 flex items-center">
            <span className="mr-3 text-lg">📅</span> 
            {formattedDate}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="mr-3 text-lg">📍</span> 
            {event.venue}
          </p>
        </div>
        
        <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
          <span className="mr-1.5">🎟️</span>
          {rsvpCount} / {event.seatLimit} Seats Booked
        </div>
      </Link>
      
      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        {userRole === 'ORGANIZER' ? (
          <Link 
            to={`/manage-event/${event.id}`} 
            className="block w-full py-2.5 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-900 transition-colors text-center"
          >
            Manage Event
          </Link>
        ) : (
          <button
            onClick={() => onRsvp && onRsvp(event.id)}
            disabled={isSoldOut}
            className={`w-full py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              isSoldOut
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'RSVP Now'}
          </button>
        )}
      </div>
      
    </div>
  );
}