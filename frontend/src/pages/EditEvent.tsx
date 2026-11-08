import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from '../components/EventForm';
import api from '../services/api';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const eventData = response.data.event || response.data;

        let formattedTime = eventData.time || '';
        if (formattedTime.includes('AM') || formattedTime.includes('PM')) {
          const [time, modifier] = formattedTime.split(' ');
          let [hours, minutes] = time.split(':');
          
          if (hours === '12') hours = '00';
          if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
          
          formattedTime = `${hours.padStart(2, '0')}:${minutes}`;
        }

        setInitialData({
            ...eventData,
            time: formattedTime
        });

      } catch (error: any) {
        alert("Error loading event details: " + (error.response?.data?.message || error.message));
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleUpdate = async (formData: any) => {
    setLoading(true);
    try {
      const response = await api.put(`/events/${id}`, {
        ...formData,
        seatLimit: Number(formData.seatLimit),
      });

      if (response.data.success) {
        alert('Event updated successfully!');
        navigate(`/manage-event/${id}`);
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      alert("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Event</h1>
          <p className="text-gray-500 mt-2">Update the details for your event below.</p>
        </div>
        
        {initialData ? (
          <EventForm 
            initialData={initialData} 
            onSubmit={handleUpdate} 
            isLoading={loading} 
            buttonText="Update Event" 
          />
        ) : (
          <div className="flex justify-center items-center py-20 text-gray-500 animate-pulse font-medium">
            Loading event details...
          </div>
        )}
      </div>
    </div>
  );
}