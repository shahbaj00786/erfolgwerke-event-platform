import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import api from '../services/api';

export default function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData: any) => {
    setLoading(true);
    try {
      const response = await api.post('/events/create', {
        ...formData,
        seatLimit: Number(formData.seatLimit),
      });

      if (response.data.success) {
        alert('Event created successfully!');
        navigate('/dashboard');
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
          <h1 className="text-3xl font-extrabold text-gray-900">Create New Event</h1>
          <p className="text-gray-500 mt-2">Fill in the details below to host your event.</p>
        </div>
        
        <EventForm onSubmit={handleCreate} isLoading={loading} buttonText="Create Event" />
      </div>
    </div>
  );
}