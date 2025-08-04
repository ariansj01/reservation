import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../API/Interceptore.ts'

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  artistId: number;
  vipPrice: string;
  normalPrice: string;
  allSellTicketPrice: string | null;
  closeBuyTicket: string;
  openBuyTicket: string;
  emptySansId: number;
}

const EventHistory = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events')
        
        if (response.status === 200) {
          setEvents(response.data)
          console.log(events)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleCloseDetails = () => {
    setSelectedEvent(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading events...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">Event History</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-lg bg-white/5 rounded-xl p-6 shadow-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
            <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Start Date:</span>
                <span className="text-white">{new Date(event.startDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">End Date:</span>
                <span className="text-white">{new Date(event.endDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Location:</span>
                <span className="text-white">{event.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">VIP Price:</span>
                <span className="text-white">${event.vipPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Normal Price:</span>
                <span className="text-white">${event.normalPrice}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleViewDetails(event)}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              View Details
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="backdrop-blur-lg bg-white/5 rounded-xl p-6 shadow-xl border border-white/10 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Event Details</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                ✕
              </motion.button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{selectedEvent.title}</h4>
                <p className="text-gray-300">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">{new Date(selectedEvent.startDate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">End Date:</span>
                    <span className="text-white">{new Date(selectedEvent.endDate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{selectedEvent.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Artist ID:</span>
                    <span className="text-white">{selectedEvent.artistId}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">VIP Price:</span>
                    <span className="text-white">${selectedEvent.vipPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Normal Price:</span>
                    <span className="text-white">${selectedEvent.normalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">All Sell Ticket Price:</span>
                    <span className="text-white">${selectedEvent.allSellTicketPrice || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Empty Sans ID:</span>
                    <span className="text-white">{selectedEvent.emptySansId}</span>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Ticket Information</h4>
                <div className="space-y-2">
                  <p className="text-gray-300">Open Buy Ticket: {new Date(selectedEvent.openBuyTicket).toLocaleString()}</p>
                  <p className="text-gray-300">Close Buy Ticket: {new Date(selectedEvent.closeBuyTicket).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EventHistory