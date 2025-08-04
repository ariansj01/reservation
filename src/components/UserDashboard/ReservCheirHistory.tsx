import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import api from '../../API/Interceptore.ts'
import { CalendarIcon, ClockIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

// interface Reservation {
//   id: number;
//   eventId: number;
//   eventName: string;
//   startDate: string;
//   endDate: string;
//   location: string;
//   chairs: {
//     id: number;
//     row: string;
//     number: string;
//     type: string;
//     price: string;
//   }[];
//   totalPrice: number;
//   status: string;
// }

const ReservCheirHistory = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User not logged in');
        }

        // Fetch user's tickets
        const ticketsResponse = await api.get(`/tickets?userId=${userId}`)

        if (ticketsResponse.status === 200) {
          const tickets = ticketsResponse.data.data;
          const uniqueEventIds = [...new Set(tickets.map((ticket: any) => ticket.eventId))];
          
          // Fetch details for each event
          const reservationsData = await Promise.all(
            uniqueEventIds.map(async (eventId) => {
              const eventResponse = await api.get(`/events/${eventId}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`
                }
              });

              const event = eventResponse.data.data;
              const eventTickets = tickets.filter((ticket: any) => ticket.eventId === eventId);
              
              // Fetch chair details for each ticket
              const chairs = await Promise.all(
                eventTickets.map(async (ticket: any) => {
                  const chairResponse = await api.get(`/cheirs/${ticket.cheireId}`)
                  return chairResponse.data.data;
                })
              );

              return {
                id: eventId,
                eventId: eventId,
                eventName: event.title,
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location,
                chairs: chairs,
                totalPrice: chairs.reduce((sum, chair) => sum + Number(chair.price), 0),
                status: 'Active'
              };
            })
          );

          setReservations(reservationsData);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">My Reservations</h2>
      <div className="space-y-6">
        {reservations.map((reservation, index) => (
          <motion.div
            key={reservation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-4">{reservation.eventName}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <CalendarIcon className="w-5 h-5 text-purple-400" />
                    <span>{new Date(reservation.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <ClockIcon className="w-5 h-5 text-purple-400" />
                    <span>{new Date(reservation.startDate).toLocaleTimeString()} - {new Date(reservation.endDate).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPinIcon className="w-5 h-5 text-purple-400" />
                    <span>{reservation.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CurrencyDollarIcon className="w-5 h-5 text-purple-400" />
                    <span>Total: ${reservation.totalPrice}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Reserved Chairs</h4>
                  <div className="flex flex-wrap gap-2">
                    {reservation.chairs.map((chair:any) => (
                      <div key={chair.id} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">
                        {chair.type === 'vip' ? 'VIP' : 'Normal'} - Row {chair.row} Seat {chair.number}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reservation.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG 
                    value={`Event: ${reservation.eventName}\nDate: ${new Date(reservation.startDate).toLocaleDateString()}\nTime: ${new Date(reservation.startDate).toLocaleTimeString()}\nChairs: ${reservation.chairs.map((c:any) => `Row ${c.row} Seat ${c.number}`).join(', ')}`}
                    size={128}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="mt-4 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-300"
                >
                  Print Ticket
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReservCheirHistory;