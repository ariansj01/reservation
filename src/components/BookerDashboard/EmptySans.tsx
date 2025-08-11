import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../API/Interceptore.ts';
import { toast } from 'react-toastify';
import Notification from '../Notification';

interface Sans {
  id: string;
  name: string;
  description: string;
  openTime: string;
  closeTime: string;
  price: number;
  artistId: number;
  location?: string;
}

interface EventForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  artistId: number;
  vipPrice: string;
  normalPrice: string;
  allSellTicketPrice: string;
  location: string;
  closeBuyTicket: string;
  openBuyTicket: string;
  emptySansId: number;
}

const EmptySans = () => {
  const [selectedSans, setSelectedSans] = useState<Sans | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [mockSans, setMockSans] = useState<Sans[]>([]);
  const [formData, setFormData] = useState<EventForm>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location : '',
    artistId: 1,
    vipPrice: '',
    normalPrice: '',
    allSellTicketPrice: '',
    closeBuyTicket: '',
    openBuyTicket: '',
    emptySansId: 1,
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  const handleSansSelect = (sans: Sans) => {
    setSelectedSans(sans);
    // Set default values from the selected sans
    const startDate = new Date(sans.openTime).toISOString();
    const endDate = new Date(sans.closeTime).toISOString();
    
    setFormData(prev => ({
      ...prev,
      startDate: startDate,
      endDate: endDate,
      emptySansId: parseInt(sans.id),
      artistId: 9,
      location: sans.location || ''
    }));
    setShowEventForm(true);
  };

  const getSans = async () => {
    let sans = await api.get('/empty-sans', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`
      }
    })
    if (sans.status === 200) {
      setMockSans(sans.data.data)
    }
  }

  useEffect(() => {
    getSans()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    let user : any = localStorage.getItem('user')
    let artistId = JSON.parse(user)
      // Ensure dates are properly formatted before sending
      const formattedData = {
        title : formData.title,
        description : formData.description,
        artistId : artistId[0].id,
        vipPrice : formData.vipPrice,
        normalPrice : formData.normalPrice,
        allSellTicketPrice : formData.allSellTicketPrice,
        emptySansId : formData.emptySansId,
        reserved : 0,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        openBuyTicket: new Date(formData.openBuyTicket).toISOString(),
        closeBuyTicket: new Date(formData.closeBuyTicket).toISOString()
      };
      console.log(formattedData)
      const response = await api.post('/events', formattedData)
      if (response.status === 201) {
        // Delete the empty sans after successful event creation
        try {
          console.log(response.data.data)
          await api.delete(`/empty-sans/${formData.emptySansId}`);
          // Refresh the empty sans list
          getSans();
        } catch (deleteError) {
          console.error('Error deleting empty sans:', deleteError);
        } 
        setShowEventForm(false);
        setFormData({
          title: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          artistId: 1,
          vipPrice: '',
          normalPrice: '',
          allSellTicketPrice: '',
          closeBuyTicket: '',
          openBuyTicket: '',
          emptySansId: 0,
        });
      }
    } catch (error : any) {
      console.error('Error creating event:', error);
      if(error.response?.status === 404){
        toast.error(error.response.data.message)
        setShowNotification(true)
        setNotificationMessage(error.response.data.message)
        setNotificationType('error')
        return
      }  
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!showEventForm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Available Sans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSans.map((sans) => (
            <motion.div
              key={sans.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-lg bg-white/5 rounded-xl p-6 shadow-xl border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{sans.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Start Time:</span>
                  <span className="text-white">{new Date(sans.openTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">End Time:</span>
                  <span className="text-white">{new Date(sans.closeTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Description:</span>
                  <span className="text-white">{sans.description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white">${sans.price}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSansSelect(sans)}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Select Sans
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Create Event</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowEventForm(false)}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          ← Back to Sans
        </motion.button>
      </div>

      <div className="backdrop-blur-lg bg-white/5 rounded-xl p-6 shadow-xl border border-white/10 mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Selected Sans</h3>
        <div className="space-y-2">
          <p className="text-gray-300">Name: {selectedSans?.name}</p>
          <p className="text-gray-300">Time: {new Date(selectedSans?.openTime || '').toLocaleString()} - {new Date(selectedSans?.closeTime || '').toLocaleString()}</p>
          <p className="text-gray-300">Price: ${selectedSans?.price}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </motion.div>

          <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">Start Date</label>
            <input
              type="text"
              value={formData.startDate ? new Date(formData.startDate).toLocaleString() : ''}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed"
            />
          </motion.div>

          <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">End Date</label>
            <input
              type="text"
              value={formData.endDate ? new Date(formData.endDate).toLocaleString() : ''}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed"
            />
          </motion.div>

          {/* <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">Artist ID</label>
            <input
              type="text"
              value={formData.artistId}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed"
            />
          </motion.div> */}

          <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">VIP Price</label>
            <input
              type="text"
              name="vipPrice"
              value={formData.vipPrice}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </motion.div>

          <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">Normal Price</label>
            <input
              type="text"
              name="normalPrice"
              value={formData.normalPrice}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </motion.div>

          {/* <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">All Sell Ticket Price</label>
            <input
              type="text"
              name="allSellTicketPrice"
              value={formData.allSellTicketPrice}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </motion.div> */}

          <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">Open Buy Ticket</label>
            <input
              type="datetime-local"
              name="openBuyTicket"
              value={formData.openBuyTicket}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </motion.div>

          <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block text-gray-300 mb-2">Close Buy Ticket</label>
            <input
              type="datetime-local"
              name="closeBuyTicket"
              value={formData.closeBuyTicket}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </motion.div>
        </div>

        <motion.div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
          <label className="block text-gray-300 mb-2">Event Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
        </motion.div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setShowEventForm(false)}
            className="flex-1 bg-white/5 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 border border-white/10"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Create Event
          </motion.button>
        </div>
      </form>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          duration={4000}
          onClose={() => {
            setShowNotification(false);
          }}
        />
      )}
    </motion.div>
  );
};

export default EmptySans;