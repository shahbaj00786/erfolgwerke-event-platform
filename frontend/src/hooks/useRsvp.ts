import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAppContext } from '../context/AppContext';

export const useRsvp = (onSuccess?: () => void) => {
  const { token } = useAppContext();
  const navigate = useNavigate();

  const handleRsvp = async (eventId: any) => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await api.post('/rsvps/create', { eventId: Number(eventId) });
      
      if (response.data.success) {
        alert("RSVP Successful! You are going to this event.");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(response.data.message || "Failed to RSVP");
      }
    } catch (error: any) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return { handleRsvp };
};