
export const exportEventsToCSV = (events: any[]) => {
  let csvContent = "Event Name,Date,Bookings/Capacity\n";

  events.forEach((event: any) => {
    const eventName = `"${event.title || event.name || ''}"`;
    const eventDate = `"${event.date || ''}"`;
    const bookings = `"${event._count?.rsvps || event.rsvps?.length || 0} / ${event.seatLimit || 0}"`;
    
    csvContent += `${eventName},${eventDate},${bookings}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'erfolgwerke_events_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};