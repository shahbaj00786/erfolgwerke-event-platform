import { Link } from 'react-router-dom';

interface EventActionCardProps {
  event: any;
  userRole: string | null;
  onRsvp: () => void;
}

export default function EventActionCard({ event, userRole, onRsvp }: EventActionCardProps) {
  const rsvpCount = event._count?.rsvps || event.rsvps?.length || 0;
  const isSoldOut = rsvpCount >= event.seatLimit;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
      
      <div className="mb-6">
        <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
          <span className="text-xl mr-3">🎟️</span>
          <span><strong className="text-gray-900 text-lg">{rsvpCount} / {event.seatLimit}</strong> seats booked</span>
        </div>
      </div>

      {userRole === 'ORGANIZER' ? (
        <Link 
          to={`/manage-event/${event.id}`} 
          className="block w-full py-3.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors text-center"
        >
          Manage Event
        </Link>
      ) : (
        <button
          onClick={onRsvp}
          disabled={isSoldOut}
          className={`hover:cursor-pointer w-full py-3.5 font-bold rounded-xl transition-all duration-200 ${
            isSoldOut
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
          }`}
        >
          {isSoldOut ? 'Sold Out' : 'RSVP Now'}
        </button>
      )}
    </div>
  );
}