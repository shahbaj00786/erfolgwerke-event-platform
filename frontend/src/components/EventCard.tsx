import { Link } from 'react-router-dom';

interface EventCardProps {
  event: any; 
  userRole: string | null;
  isRegistered?: boolean; 
  onRsvp?: (id: number) => void;
  onCancel?: (rsvpId: number) => void; 
}

export default function EventCard({ event, userRole, isRegistered, onRsvp, onCancel }: EventCardProps) {
  const rsvpCount = event._count?.rsvps || event.rsvps?.length || 0;
  const isSoldOut = rsvpCount >= event.seatLimit;

  const formattedDate = new Date(event.date).toLocaleDateString(undefined, { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
  });

  const CardInnerContent = (
    <>
      <h2 className={`text-xl font-bold text-gray-900 mb-4 transition-colors line-clamp-2 ${!onCancel ? 'group-hover:text-blue-600' : ''}`}>
        {event.title}
      </h2>
      
      <div className="space-y-3 mb-5">
        <p className="text-sm text-gray-600 flex items-center"><span className="mr-3 text-lg">📅</span> {formattedDate}</p>
        <p className="text-sm text-gray-600 flex items-center"><span className="mr-3 text-lg">📍</span> {event.venue}</p>
      </div>
      
      <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
        <span className="mr-1.5">🎟️</span>
        {rsvpCount} / {event.seatLimit} Seats Booked
      </div>
    </>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      
      {onCancel ? (
        <div className="p-6 block flex-grow">{CardInnerContent}</div>
      ) : (
        <Link to={`/event/${event.id}`} className="p-6 block flex-grow cursor-pointer group">{CardInnerContent}</Link>
      )}

      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        {userRole === 'ORGANIZER' ? (
          <Link 
            to={`/manage-event/${event.id}`} 
            className="block w-full py-2.5 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-900 transition-colors text-center"
          >
            Manage Event
          </Link>
        ) : onCancel ? (
          <button
            onClick={(e) => { e.preventDefault(); onCancel(event.rsvpId); }}
            className="hover:cursor-pointer w-full py-2.5 text-sm font-bold rounded-xl transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md active:scale-[0.98]"
          >
            Cancel Ticket
          </button>
        ) : isRegistered ? (
          <button
            disabled
            className="w-full py-2.5 text-sm font-bold rounded-xl transition-all duration-200 bg-green-50 text-green-700 border border-green-200 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>✅</span> Registered
          </button>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); onRsvp && onRsvp(event.id); }}
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