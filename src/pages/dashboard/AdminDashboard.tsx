import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomeIcon } from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/80 via-blue-800/80 to-indigo-900/80 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={() => navigate('/landing')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
          <nav className="flex space-x-4">
            <NavLink 
              to="sellStatus"
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              Sell Status
            </NavLink>
            <NavLink 
              to="addSans"
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              Add Sans
            </NavLink>
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard