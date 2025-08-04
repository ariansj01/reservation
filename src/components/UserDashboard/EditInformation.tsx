import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Notification from '../../components/Notification'
import api from '../../API/Interceptore.ts'
// import { useNavigate } from 'react-router-dom'

const EditInformation = () => {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
  // const navigate = useNavigate()


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // currentPassword: '',
    // newPassword: '',
    // confirmPassword: '',
    password: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
    const user = await api.get(`/user/${formData.email}`)
    console.log(user.data.data.id)
    try {
      let login = await api.put(`/users/${user.data.data.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`
        }
      })
      if (login.status === 200) {
        localStorage.setItem('AccessToken', login.data.AccessToken);
        localStorage.setItem('RefreshToken', login.data.RefreshToken);
        setNotificationMessage('Login successful! Redirecting...');
        setNotificationType('success');
        setShowNotification(true);
      }
    } catch (err) {
      console.log(err);
      setNotificationMessage('Login failed. Please check your credentials.');
      setNotificationType('error');
      setShowNotification(true);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <h2 className="text-2xl font-bold text-white mb-6">Edit Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-white/80">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter password"
            />
          </div>

          {/* <div className="space-y-2">
            <label className="block text-white/80">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white/80">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Confirm new password"
            />
          </div> */}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-6 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-300 font-medium"
        >
          Save Changes
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

export default EditInformation
