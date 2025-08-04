import { useState } from 'react'
import { motion } from 'framer-motion'

// Mock data - replace with actual data from your backend
const mockPayments = [
  {
    id: 1,
    eventName: 'Rock Concert',
    date: '2024-03-15',
    amount: 200,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    transactionId: 'TRX-12345'
  },
  {
    id: 2,
    eventName: 'Jazz Night',
    date: '2024-03-20',
    amount: 150,
    paymentMethod: 'PayPal',
    status: 'Completed',
    transactionId: 'TRX-12346'
  },
  {
    id: 3,
    eventName: 'Pop Festival',
    date: '2024-03-25',
    amount: 300,
    paymentMethod: 'Credit Card',
    status: 'Pending',
    transactionId: 'TRX-12347'
  }
]

const PaymentHistory = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null)

  const totalAmount = mockPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalTransactions = mockPayments.length

  const handleMakePayment = (paymentId: number) => {
    setSelectedPayment(paymentId)
    setShowPaymentModal(true)
  }

  const handleCloseModal = () => {
    setShowPaymentModal(false)
    setSelectedPayment(null)
  }

  const handleConfirmPayment = () => {
    // Here you would typically integrate with a payment gateway
    console.log('Processing payment for:', selectedPayment)
    // After successful payment, update the payment status
    handleCloseModal()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Payment History</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white/80 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-white">${totalAmount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white/80 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-white">{totalTransactions}</p>
        </motion.div>
      </div>

      {/* Payment List */}
      <div className="space-y-6">
        {mockPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{payment.eventName}</h3>
                <div className="space-y-1 text-white/80">
                  <p>Date: {payment.date}</p>
                  <p>Amount: ${payment.amount}</p>
                  <p>Method: {payment.paymentMethod}</p>
                  <p>Transaction ID: {payment.transactionId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  payment.status === 'Completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {payment.status}
                </span>
                {payment.status === 'Pending' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMakePayment(payment.id)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-300"
                  >
                    Make Payment
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-xl p-8 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Complete Payment</h3>
              <button
                onClick={handleCloseModal}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-white/80 space-y-4 mb-6">
              <p>Event: {mockPayments.find(p => p.id === selectedPayment)?.eventName}</p>
              <p>Amount: ${mockPayments.find(p => p.id === selectedPayment)?.amount}</p>
              <p>Transaction ID: {mockPayments.find(p => p.id === selectedPayment)?.transactionId}</p>
              <div className="mt-4">
                <label className="block text-white/80 mb-2">Payment Method</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white">
                  <option value="credit">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseModal}
                className="flex-1 py-3 px-6 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmPayment}
                className="flex-1 py-3 px-6 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-300 font-medium"
              >
                Confirm Payment
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PaymentHistory
