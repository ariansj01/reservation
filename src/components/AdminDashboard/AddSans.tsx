import React, { useState } from 'react'
import { motion } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'
import Notification from '../../components/Notification'
import api from '../../API/Interceptore.ts'

const AddSans = () => {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
  // const navigate = useNavigate()


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    openTime: '',
    closeTime: '',
    price: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Format the date/time values before sending
      const formattedData = {
        ...formData,
        // Format time as 'HH:mm:ss' with leading zeros
        openTime: formData.openTime.padStart(5, '0') + ':00',
        closeTime: formData.closeTime.padStart(5, '0') + ':00',
        price: parseFloat(formData.price)
      }

      console.log('Sending data:', formattedData); // For debugging
      let sans = await api.post('/empty-sans', formattedData)   
      if (sans.status === 201) {
        setNotificationMessage('Sans added successfully!');
        setNotificationType('success');
        setShowNotification(true);
        // Reset form after successful submission
        setFormData({
          name: '',
          description: '',
          openTime: '',
          closeTime: '',
          price: ''
        });
      }
    } catch (err) {
      console.log('Error details:', err); // For debugging
      setNotificationMessage('Failed to add sans. Please check your input.');
      setNotificationType('error');
      setShowNotification(true);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Add New Sans</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-white/80">Sans Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter sans name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter price"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">Open Time</label>
            <input
              type="time"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">Close Time</label>
            <input
              type="time"
              name="closeTime"
              value={formData.closeTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-white/80">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Enter description"
            rows={4}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-6 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-300 font-medium"
        >
          Add Sans
        </motion.button>
      </form>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          duration={2000}
          onClose={() => {
            setShowNotification(false);
            if (notificationType === 'success') {
              // navigate('/user-dashboard');
            }
          }}
        />
      )}
    </motion.div>
  )
}

export default AddSans