import  { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  UserGroupIcon,
  TicketIcon,
  MusicalNoteIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Check user role from localStorage or API
    const role = localStorage.getItem('userRole');
    console.log('Current user role:', role); // Debug log
    setUserRole(role || 'user'); // Set default role to 'user' if none exists

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('email');
    navigate('/login');
  };

  // Modify navigationItems to ensure at least some items are always visible
  const navigationItems = [
    // {
    //   name: 'Home',
    //   icon: HomeIcon,
    //   path: '/',
    //   roles: ['user', 'admin', 'artist', ''] // Add empty string to show for all roles
    // },
    {
      name: 'User Dashboard',
      icon: UserIcon,
      path: '/user-dashboard',
      roles: ['user', 'admin', 'artist', ''] // Temporarily show for all roles
    },
    {
      name: 'Admin Dashboard',
      icon: UserGroupIcon,
      path: '/admin-dashboard',
      roles: ['user', 'admin', 'artist', ''] // Temporarily show for all roles
    },
    {
      name: 'Artist Dashboard',
      icon: MusicalNoteIcon,
      path: '/artist-dashboard',
      roles: ['user', 'admin', 'artist', ''] // Temporarily show for all roles
    },
    {
      name: 'Book Concert',
      icon: TicketIcon,
      path: '/booking',
      roles: ['user', 'admin', 'artist', ''] // Add empty string to show for all roles
    }
  ];

  // Modify the filter to show items if no role is set
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(userRole || '') || userRole === null
  );

  // Add debug log for filtered navigation after declaration
  console.log('Filtered navigation items:', filteredNavigation);

  const Sidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50"
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Concert Booking
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {filteredNavigation.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              navigate(item.path);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-purple-600 text-white'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );

  const MobileNav = () => (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 md:hidden z-50"
    >
      <div className="flex justify-around items-center p-2">
        {filteredNavigation.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-800 md:hidden"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 md:ml-64">
              Concert Booking
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Welcome, {localStorage.getItem('email')}
              </span>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 p-2 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && <Sidebar />}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-16 ${!isMobile ? 'md:ml-64' : ''} min-h-screen`}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNavigation.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <item.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Click to navigate to {item.name.toLowerCase()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Landing;