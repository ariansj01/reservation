const PaymentService = require('../services/payment.service');

class PaymentController {
    static async createPayment(req, res) {
        try {
            const { amount, description, callbackUrl } = req.body;
            
            const payment = await PaymentService.createPayment(
                amount,
                description,
                callbackUrl
            );

            res.json(payment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async verifyPayment(req, res) {
        try {
            const { Authority, Amount } = req.query;
            
            const verification = await PaymentService.verifyPayment(
                Amount,
                Authority
            );

            if (verification.success) {
                res.json({
                    success: true,
                    message: 'Payment verified successfully',
                    refId: verification.refId
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Payment verification failed'
                });
            } 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PaymentController; 