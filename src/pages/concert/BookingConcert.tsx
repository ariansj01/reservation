import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react'; 
import { XMarkIcon, CurrencyDollarIcon, CreditCardIcon, CalendarIcon, MapPinIcon, StarIcon, ChevronDownIcon, HomeIcon } from '@heroicons/react/24/outline';
import api from '../../API/Interceptore.ts';
import { useParams, useNavigate } from 'react-router-dom';
// import PaymentButton from '../../components/Paypal';

interface ApiChair {
  id: number;
  row: string;
  number: string;
  type: string;
  userId: number;
  eventId: number;
  price: string;
  status: boolean;
}

interface Chair extends ApiChair {
  // Additional properties specific to the frontend if needed
}

interface EventDetails {
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
  reserved?: string;
}

interface Comment {
  id: number;
  text: string;
  eventId: number;
  userId: number;
  artistId: number;
  user?: {
    email: string;
  };
}

interface Payment {
  id: number;
  price: string;
  cardNumber: string;
  dateCard: string;
  cvv: string;
  userId: number;
  eventId: number;
  cheireId: string;
}

interface Ticket {
  id: number;
  userId: number;
  eventId: number;
  cheireId: number;
}

const BookingConcert = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChairs, setSelectedChairs] = useState<number[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [paymentLogs, setPaymentLogs] = useState<Array<{
    id: number;
    chairs: number[];
    amount: number;
    timestamp: string;
    eventId: number;
  }>>([]);
  console.log(setPaymentLogs(paymentLogs))
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    text: '',
    rating: 0
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  console.log(tickets)
  const fetchEvents = async () => {
    try {
      const response = await api.get('/events')
      console.log(response)
      if (response.status === 200) {
        setEvents(response.data.data);
        console.log(response.data.data)
        if (id) {
          const event = response.data.data.find((e: EventDetails) => e.id === parseInt(id));
          if (event) {
            setSelectedEvent(event);
            // First fetch all chairs for this event
            const chairsResponse = await api.get(`/cheirs?eventId=${event.id}`)  
            if (chairsResponse.status === 200) {
              const existingChairs = chairsResponse.data.data;
              if (existingChairs.length > 0) {
                setChairs(existingChairs);
              } else {
                // If no chairs exist, generate them
                const generatedChairs = generateChairs();
                setChairs(generatedChairs);
              }
            }
          }
        } else if (response.data.data.length > 0) {
          setSelectedEvent(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, [id]);

  // Fetch current user ID
  const fetchCurrentUserId = async () => {
    const email = localStorage.getItem('email');
    if (email) {
      try {
        const response = await api.get(`/user/${email}`)
        if (response.status === 200) {
          setCurrentUserId(response.data.data.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }
  };
  useEffect(() => {
    fetchCurrentUserId();
  }, []);

  // Fetch comments for the selected event
  useEffect(() => {
    const fetchComments = async () => {
      if (selectedEvent) {
        try {
          const response = await api.get('/comments', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`
            },
            params: {
              eventId: selectedEvent.id
            }
          });
          if (response.status === 200) {
            setComments(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchComments();
  }, [selectedEvent]);

  // Fetch chairs for the selected event
  // useEffect(() => {
  //   const fetchChairs = async () => {
  //     if (selectedEvent) {
  //       try {
  //         const response = await api.get('http://localhost:8080/api/v1/cheirs', {
  //           headers: {
  //             'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`
  //           },
  //           params: {
  //             eventId: selectedEvent.id
  //           }
  //         });
  //         if (response.status === 200) {
  //           setChairs(response.data.data);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching chairs:', error);
  //       }
  //     }
  //   };

  //   fetchChairs();
  // }, [selectedEvent]);

  // Create initial chairs if none exist
  useEffect(() => {
    const createInitialChairs = async () => {
      if (selectedEvent && chairs.length === 0) {
        const initialChairs = generateChairs();
        console.log(initialChairs)
        try {
          for (const chair of initialChairs) {
            await api.post('/cheirs', chair);
          }
          // After creating initial chairs, fetch them
          const response = await api.get('/cheirs', {
            params: {
              eventId: selectedEvent.id
            }
          });
          if (response.status === 200) {
            setChairs(response.data.data);
          }
        } catch (error) {
          console.error('Error creating initial chairs:', error);
        }
      }
    };

    createInitialChairs();
  }, [selectedEvent, chairs.length]);

  // Fetch payment history for current user
  useEffect(() => {
    const fetchPayments = async () => {
      if (currentUserId) {
        try {
          const response = await api.get('/user-payments', {
            params: {
              userId: currentUserId
            }
          });
          if (response.status === 200) {
            setPayments(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching payments:', error);
        }
      }
    };

    fetchPayments();
  }, [currentUserId]);

  // Fetch tickets for current user
  useEffect(() => {
    const fetchTickets = async () => {
      if (currentUserId) {
        try {
          const response = await api.get('/tickets', {
            params: {
              userId: currentUserId
            }
          });
          if (response.status === 200) {
            setTickets(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      }
    };

    fetchTickets();
  }, [currentUserId]);

  // Create a more realistic concert hall layout
  const generateChairs = () => {
    const chairs: Chair[] = [];
    let id = 1;
    
    // VIP Section (Front rows)
    for (let row = 1; row <= 3; row++) {
      for (let num = 1; num <= 10; num++) {
        chairs.push({
          id: id++,
          row: row.toString(),
          number: num.toString(),
          type: 'vip',
          status: false,
          price: selectedEvent?.vipPrice || '0',
          userId: 0,
          eventId: selectedEvent?.id || 0
        });
      }
    }
    
    // Normal Section (Back rows)
    for (let row = 4; row <= 8; row++) {
      for (let num = 1; num <= 12; num++) {
        chairs.push({
          id: id++,
          row: row.toString(),
          number: num.toString(),
          type: 'normal',
          status: false,
          price: selectedEvent?.normalPrice || '0',
          userId: 0,
          eventId: selectedEvent?.id || 0
        });
      }
    }
    
    return chairs;
  };

  useEffect(() => {
    if (selectedEvent) {
      setChairs(generateChairs());
    }
  }, [selectedEvent]);

  const handleEventChange = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedChairs([]);
      setChairs(generateChairs());
    }
  };

  const handleChairClick = (chairId: number) => {
    const chair = chairs.find(c => c.id === chairId);
    if (!chair || chair.status === true) {
      return; // Don't allow selecting reserved chairs
    }
    if (selectedChairs.includes(chairId)) {
      setSelectedChairs(selectedChairs.filter(id => id !== chairId));
    } else {
      setSelectedChairs([...selectedChairs, chairId]);
    }
  };

  useEffect(() => {
    const total = selectedChairs.reduce((sum, chairId) => {
      const chair = chairs.find(c => c.id === chairId);
      return sum + Number(chair?.price || 0);
    }, 0);
    setTotalPrice(total);
  }, [selectedChairs, chairs]);

  // Group chairs by row
  const rows = chairs.reduce((acc, chair) => {
    if (!acc[chair.row]) {
      acc[chair.row] = [];
    }
    acc[chair.row].push(chair);
    return acc;
  }, {} as Record<string, Chair[]>);

  // Update the chair display in the UI
  const renderChair = (chair: Chair) => {
    const isSelected = selectedChairs.includes(chair.id);
    const isReserved = chair.status === true;
    
    return (
      <motion.div
        key={chair.id}
        whileHover={!isReserved ? { scale: 1.05 } : {}}
        whileTap={!isReserved ? { scale: 0.95 } : {}}
        className={`
          w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center
          ${chair.type === 'vip' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gray-700'}
          ${isReserved ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isSelected ? 'ring-4 ring-green-500' : ''}
          shadow-lg hover:shadow-xl
          relative
        `}
        onClick={() => !isReserved && handleChairClick(chair.id)}
      >
        <div className="absolute top-1 left-1 w-2 h-2 bg-gray-900 rounded-full"></div>
        <div className="absolute top-1 right-1 w-2 h-2 bg-gray-900 rounded-full"></div>
        <span className="text-xs font-semibold">{chair.number}</span>
        {isReserved && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-red-500 rounded-full opacity-50"></div>
          </div>
        )}
      </motion.div>
    );
  };

  const handlePayment = async () => {
    if (!selectedEvent || !currentUserId || selectedChairs.length === 0) return;

    setPaymentStatus('processing');
    try {
      // First check if any selected chairs are already reserved
      const chairsResponse = await api.get(`/cheirs?eventId=${selectedEvent.id}`);

      if (chairsResponse.status === 200) {
        const existingChairs = chairsResponse.data.data;
        const reservedChairs = existingChairs.filter((chair: Chair) => 
          selectedChairs.includes(chair.id) && chair.status === true
        );

        if (reservedChairs.length > 0) {
          throw new Error('Some selected chairs are already reserved');
        }

        // Update chairs to reserved status
        const updatedChairs = [];
        for (const chairId of selectedChairs) {
          const chair = chairs.find(c => c.id === chairId);
          if (chair) {
            const chairData = {
              row: chair.row,
              number: chair.number,
              type: chair.type,
              userId: currentUserId,
              eventId: selectedEvent.id,
              price: chair.price,
              status: true
            };

            const chairResponse = await api.put(`/cheirs/${chairId}`, chairData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`,
                'Content-Type': 'application/json'
              }
            });

            if (chairResponse.status === 200) {
              updatedChairs.push(chairResponse.data.data);
            }
          }
        }

        if (updatedChairs.length === 0) {
          throw new Error('Failed to update chairs');
        }

        // Create payment record
        const paymentData = {
          price: totalPrice.toString(),
          cardNumber: cardDetails.number,
          dateCard: cardDetails.expiry,
          cvv: cardDetails.cvv,
          userId: currentUserId,
          eventId: selectedEvent.id,
          cheireId: updatedChairs.map(chair => chair.id).join(',')
        };

        const paymentResponse = await api.post('/user-payments', paymentData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (paymentResponse.status === 201) {
          // Create tickets for each chair
          for (const chair of updatedChairs) {
            const ticketData = {
              userId: currentUserId,
              eventId: selectedEvent.id,
              cheireId: chair.id
            };

            await api.post('/tickets', ticketData);
          }

          // Update UI
          const updatedChairsList = chairs.map(chair => 
            selectedChairs.includes(chair.id) 
              ? { ...chair, status: true, userId: currentUserId }
              : chair
          );
          setChairs(updatedChairsList);

          setPaymentStatus('success');
          setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentStatus('idle');
            setSelectedChairs([]);
            setCardDetails({ number: '', expiry: '', cvv: '' });
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('error');
      setTimeout(() => setPaymentStatus('idle'), 2000);
    }
  };

  // Add useEffect to fetch reserved chairs when event changes
  useEffect(() => {
    const fetchReservedChairs = async () => {
      if (selectedEvent) {
        try {
          const response = await api.get(`/cheirs?eventId=${selectedEvent.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`
            }
          });
          if (response.status === 200) {
            const reservedChairs = response.data.data.filter((chair: ApiChair) => chair.status === true);
            const updatedChairs = chairs.map(chair => 
              reservedChairs.some((reserved: ApiChair) => reserved.id === chair.id)
                ? { ...chair, status: true }
                : chair
            );
            setChairs(updatedChairs);
          }
        } catch (error) {
          console.error('Error fetching reserved chairs:', error);
        }
      }
    };

    fetchReservedChairs();
  }, [selectedEvent]);

  const handleAddComment = async () => {
    if (newComment.text.trim() && selectedEvent && currentUserId) {
      try {
        const commentData = {
          text: newComment.text,
          eventId: selectedEvent.id,
          rating: newComment.rating,
          userId: currentUserId,
          artistId: 9 // Fixed artist ID as per requirements
        };

        const response = await api.post('/comments', commentData);

        if (response.status === 201) {
          // Add the new comment to the list
          setComments([response.data.data, ...comments]);
          setNewComment({ text: '', rating: 0 });
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('AccessToken');
  
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-white text-xl mb-4">برای رزرو کنسرت ابتدا وارد شوید</div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            ورود به سیستم
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">No events available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-4">
        {/* Add Back to Home button at the top */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/landing')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Event Selection */}
        <div className="mb-6">
          <div className="relative">
            <select
              value={selectedEvent.id}
              onChange={(e) => handleEventChange(Number(e.target.value))}
              className="w-full p-4 bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.startDate).toLocaleDateString()}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 mb-6 border border-gray-700 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Event Info */}
            <div className="lg:w-2/3 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  {selectedEvent.title}
                </h1>
                <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarIcon className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-gray-300">Start Date</span>
                  </div>
                  <p className="text-xl text-white">{new Date(selectedEvent.startDate).toLocaleString()}</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarIcon className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-gray-300">End Date</span>
                  </div>
                  <p className="text-xl text-white">{new Date(selectedEvent.endDate).toLocaleString()}</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPinIcon className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-gray-300">Location</span>
                  </div>
                  <p className="text-xl text-white">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <CurrencyDollarIcon className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-gray-300">VIP Price</span>
                  </div>
                  <p className="text-xl text-white">${selectedEvent.vipPrice}</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <CurrencyDollarIcon className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-gray-300">Normal Price</span>
                  </div>
                  <p className="text-xl text-white">${selectedEvent.normalPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stage and Seating Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
              {/* Stage */}
              <div className="mb-8">
                <div className="h-40 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg flex items-center justify-center shadow-lg relative overflow-hidden">
                  {/* Stage Floor */}
                  <div className="absolute bottom-0 w-full h-6 bg-gray-800 rounded-b-lg"></div>
                  
                  {/* Stage Lights */}
                  <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-yellow-400/50 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-full h-4 bg-gradient-to-b from-blue-400/50 to-transparent"></div>
                  
                  {/* Stage Center */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        STAGE
                      </span>
                    </div>
                  </div>
                  
                  {/* Stage Decoration */}
                  <div className="absolute bottom-6 left-1/4 w-8 h-8 bg-gray-700 rounded-full shadow-inner"></div>
                  <div className="absolute bottom-6 right-1/4 w-8 h-8 bg-gray-700 rounded-full shadow-inner"></div>
                  
                  {/* Stage Speakers */}
                  <div className="absolute bottom-6 left-8 w-12 h-24 bg-gray-800 rounded-lg shadow-lg">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-8 w-12 h-24 bg-gray-800 rounded-lg shadow-lg">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stage Curtains */}
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-900/50 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-900/50 to-transparent"></div>
                </div>
              </div>

              {/* Seating Layout */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Seating Layout
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded"></div>
                      <span>VIP Seat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-700 rounded"></div>
                      <span>Normal Seat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Reserved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 ring-4 ring-green-500 bg-gray-700 rounded"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(rows).map(([row, chairs]) => (
                    <div key={row} className="flex justify-center gap-2">
                      {chairs.map(renderChair)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Comments
              </h2>
              <div className="space-y-4">
                {/* Add Comment Form */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <textarea
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    placeholder="Share your experience..."
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 mb-4"
                    rows={3}
                  />
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-300">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewComment({ ...newComment, rating: star })}
                          className={`w-6 h-6 rounded-full transition-colors ${
                            newComment.rating >= star
                              ? 'bg-yellow-400'
                              : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                        >
                          <StarIcon className="w-4 h-4 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleAddComment}
                    disabled={!currentUserId}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      currentUserId
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {currentUserId ? 'Add Comment' : 'Please login to comment'}
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold">{comment.user?.email || 'Anonymous'}</span>
                        </div>
                      </div>
                      <p className="text-gray-300">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary and Payment Logs */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Booking Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                  <span>Selected Seats:</span>
                  <span className="font-semibold">{selectedChairs.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                  <span>Total Price:</span>
                  <span className="text-xl font-bold text-purple-400">${totalPrice}</span>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={selectedChairs.length === 0}
                  className={`
                    w-full py-3 rounded-lg font-semibold transition-all duration-200
                    ${selectedChairs.length === 0
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }
                    shadow-lg hover:shadow-xl
                  `}
                >
                  Proceed to Payment
                </button>
                {/* <PaymentButton/> */}
              </div>
            </div>

            {/* Payment Logs */}
            {paymentLogs.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Payment History
                </h2>
                <div className="space-y-4">
                  {paymentLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className="font-semibold text-purple-400">${log.amount}</span>
                      </div>
                      <div className="text-sm">
                        Seats: {log.chairs.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Payment History
          </h2>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-400">
              <CreditCardIcon className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg">No payment history available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-colors duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <CreditCardIcon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Card Number</p>
                        <p className="font-semibold">****{payment.cardNumber.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="text-xl font-bold text-purple-400">${payment.price}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">Event ID</p>
                      <p className="font-semibold">{payment.eventId}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">Chairs</p>
                      <p className="font-semibold">{payment.cheireId}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">Card Expiry</p>
                      <p className="font-semibold">{payment.dateCard}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">Payment ID</p>
                      <p className="font-semibold">{payment.id}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-400">Payment Successful</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full rounded-lg bg-gray-800/90 backdrop-blur-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Payment Details
              </Dialog.Title>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {paymentStatus === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                    <span>Total Amount:</span>
                    <span className="text-xl font-bold text-purple-400">${totalPrice}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <CreditCardIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="w-full pl-10 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Pay Now
                  </button>
                </motion.div>
              )}

              {paymentStatus === 'processing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center p-8"
                >
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-semibold">Processing Payment...</p>
                </motion.div>
              )}

              {paymentStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center p-8"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-green-400">Payment Successful!</p>
                </motion.div>
              )}

              {paymentStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center p-8"
                >
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-red-400">Payment Failed</p>
                  <button
                    onClick={() => setPaymentStatus('idle')}
                    className="mt-4 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default BookingConcert;