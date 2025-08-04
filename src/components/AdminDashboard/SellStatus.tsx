import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../API/Interceptore.ts'

interface Sans {
  id: number;
  name: string;
  description: string;
  openTime: string;
  closeTime: string;
  price: number;
  location: string;
}

const SellStatus = () => {
  const [sansList, setSansList] = useState<Sans[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSansData = async () => {
    console.log(localStorage.getItem('AccessToken'))
    try {
      // Check if AccessToken exists
      const accessToken = localStorage.getItem('AccessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      console.log('Sending request with token:', accessToken);
      const response = await api.get('/empty-sans')
      if (response.status === 200) {
        setSansList(response.data.data);
        console.log(response.data.data)
      }
    } catch (error: any) {
      // if (api.isAxiosError(error)) {
      //   console.error('Request failed:', {
      //     status: error.response?.status,
      //     headers: error.response?.headers,
      //     data: error.response?.data
      //   });
      // }
      console.error('Error fetching sans data:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sans?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const accessToken = localStorage.getItem('AccessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      const response = await api.delete(`/empty-sans/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 200) {
        // Remove the deleted sans from the list
        setSansList(sansList.filter(sans => sans.id !== id));
      }
    } catch (error) {
      console.error('Error deleting sans:', error);
      alert('Failed to delete sans. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchSansData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Sans Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/80 border-b border-white/20">
                <th className="pb-4">Name</th>
                <th className="pb-4">Description</th>
                <th className="pb-4">Open Time</th>
                <th className="pb-4">Close Time</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sansList.map((sans, index) => (
                <motion.tr
                  key={sans.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/10"
                >
                  <td className="py-4 text-white">{sans.name}</td>
                  <td className="py-4 text-white/80 max-w-xs truncate">{sans.description}</td>
                  <td className="py-4 text-white/80">
                    {new Date(sans.openTime).toLocaleString()}
                  </td>
                  <td className="py-4 text-white/80">
                    {new Date(sans.closeTime).toLocaleString()}
                  </td>
                  <td className="py-4 text-white">${sans.price}</td>
                  <td className="py-4">
                    <button
                      onClick={() => handleDelete(sans.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

export default SellStatus