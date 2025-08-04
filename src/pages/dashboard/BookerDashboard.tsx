import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import EmptySans from '../../components/BookerDashboard/EmptySans';
import EventHistory from '../../components/BookerDashboard/EventHistory';

const BookerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'empty' | 'history'>('empty');
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Booking Dashboard</h1>
              <p className="text-gray-400">Manage your events and view history</p>
            </div>
            <button
              onClick={() => navigate('/landing')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('empty')}
            className={`px-6 py-3 rounded-lg backdrop-blur-lg transition-all duration-300 ${
              activeTab === 'empty'
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg border border-white/10'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
            }`}
          >
            Empty Sans
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg backdrop-blur-lg transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg border border-white/10'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
            }`}
          >
            Event History
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 shadow-xl border border-white/10"
        >
          {activeTab === 'empty' ? <EmptySans /> : <EventHistory />}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookerDashboard;