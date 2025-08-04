import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import api from '../API/Interceptore.ts'
import Notification from './Notification'

const Verify_Email = () => {
  const [verificationCode, setVerificationCode] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
  // const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/verification-email', {veryCode : verificationCode})
      console.log(response)
      if (response.status === 200) {
        setNotificationMessage('Email verified successfully! Redirecting...')
        setNotificationType('success')
        setShowNotification(true)
        // Redirect after successful verification
        setTimeout(() => {
          // navigate('/user-dashboard')
        }, 2000)
      }
    } catch (err) {
      console.error(err)
      setNotificationMessage('Verification failed. Please check your code and try again.')
      setNotificationType('error')
      setShowNotification(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-spin-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-spin-slow-reverse"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8 transform transition-all duration-500 hover:scale-105">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Please enter the 6-digit verification code sent to your email
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="verificationCode" className="sr-only">Verification Code</label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                maxLength={6}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                Verify Email
              </button>
            </div>
          </form>
        </div>
      </div>

      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          duration={2000}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  )
}

export default Verify_Email