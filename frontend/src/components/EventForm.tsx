import { useState, useEffect } from 'react';

interface EventFormProps {
  initialData?: any; 
  onSubmit: (formData: any) => void;
  isLoading: boolean;
  buttonText: string;
}

export default function EventForm({ initialData, onSubmit, isLoading, buttonText }: EventFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    seatLimit: ''

  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        time: initialData.time || '',
        venue: initialData.venue || '',
        seatLimit: initialData.seatLimit || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { 
        e.preventDefault();
        const selectedDate = new Date(formData.date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (selectedDate < currentDate) {
          alert("Past dates are not allowed! Please select a valid future date.");
          return;
        }
        onSubmit(formData); 
     }} 
     
     className="bg-white p-8 border border-gray-100 rounded-2xl shadow-xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
          <input type="date" name="date" min={today} value={formData.date} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Venue</label>
          <input type="text" name="venue" value={formData.venue} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Total Seats</label>
          <input type="number" name="seatLimit" value={formData.seatLimit} onChange={handleChange} required min="1"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
        </div>
      </div>

      <button type="submit" disabled={isLoading}
        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-70">
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
}