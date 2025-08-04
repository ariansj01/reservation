const express = require("express");
const router = express.Router();
const userController = require('../controllers/User.controller');
const eventController = require('../controllers/Event.controller');
const artistController = require('../controllers/Artist.controller');
const commentController = require('../controllers/Comments.controller');
const ticketController = require('../controllers/Ticket.controller');
const cheirController = require('../controllers/Cheirs.controller');
const paymentUserController = require('../controllers/PaymentUser.controller');
const paymentArtistController = require('../controllers/PaymentArtist.controller');
const emptySansController = require('../controllers/EmptySans.controller');
const authController = require('../controllers/auth.controller');
const captchaController = require('../controllers/Captcha.controller');
const sendEmailController = require('../controllers/SendEmail.controller');
const checkAuth = require('../middleware/CheckAuth');
const paypalController = require('../controllers/PayPal.controller');
// auth
router.post('/login', authController.login);
router.post('/verify-token', authController.VerifyToken);
// router.post('/verify-code', authController.verifyCode);
router.post('/users', userController.CreateUser);
router.get('/user/:email', userController.GetUserByEmail);
router.get('/users', userController.GetUser);
router.post('/verify-captcha', captchaController.verifyCaptcha);
router.post('/verification-email', sendEmailController.VerificationCode);
router.post('/send-verification-email', sendEmailController.sendVerificationEmail);

router.use(checkAuth)

// PayPal routes
router.get('/payment', paypalController.payment);
router.get('/paypal/verify', paypalController.verify);

// User routes
router.put('/users/:id', userController.UpdateUser);
router.delete('/users/:id', userController.DeleteUser);

// Event routes
router.get('/events', eventController.GetAllEvents);
router.get('/events/:id', eventControlltEventById);
router.get('/events/artist/:artistId', eventController.GetEventsByArtistId);
router.post('/events', eventController.CreateEvent);
router.put('/events/:id', eventController.UpdateEvent);
router.delete('/events/:id', eventController.DeleteEvent);

// Artist routes
router.get('/artists', artistController.GetAllArtists);
router.get('/artists/:id', artistController.GetArtistById);
router.post('/artists', artistController.CreateArtist);
router.put('/artists/:id', artistController.UpdateArtist);
router.delete('/artists/:id', artistController.DeleteArtist);

// Comments routes
router.get('/comments', commentController.GetAllComments);
router.get('/comments/:id', commentController.GetCommentById);
router.post('/comments', commentController.CreateComment);
router.put('/comments/:id', commentController.UpdateComment);
router.delete('/comments/:id', commentController.DeleteComment);

// Ticket routes
router.get('/tickets', ticketController.GetAllTickets);
router.get('/tickets/:id', ticketController.GetTicketById);
router.post('/tickets', ticketController.CreateTicket);
router.put('/tickets/:id', ticketController.UpdateTicket);
router.delete('/tickets/:id', ticketController.DeleteTicket);

// Cheirs routes
router.get('/cheirs', cheirController.GetAllCheirs);
router.get('/cheirs/:id', cheirController.GetCheirById);
router.post('/cheirs', cheirController.CreateCheir);
router.put('/cheirs/:id', cheirController.UpdateCheir);
router.delete('/cheirs/:id', cheirController.DeleteCheir);

// User Payment routes
router.get('/user-payments', paymentUserController.GetAllUserPayments);
router.get('/user-payments/:id', paymentUserController.GetUserPaymentById);
router.post('/user-payments', paymentUserController.CreateUserPayment);
router.put('/user-payments/:id', paymentUserController.UpdateUserPayment);
router.delete('/user-payments/:id', paymentUserController.DeleteUserPayment);

// Artist Payment routes
router.get('/artist-payments', paymentArtistController.GetAllArtistPayments);
router.get('/artist-payments/:id', paymentArtistController.GetArtistPaymentById);
router.post('/artist-payments', paymentArtistController.CreateArtistPayment);
router.put('/artist-payments/:id', paymentArtistController.UpdateArtistPayment);
router.delete('/artist-payments/:id', paymentArtistController.DeleteArtistPayment);

// Empty Sans routes
router.get('/empty-sans', emptySansController.GetAllEmptySans);
router.get('/empty-sans/:id', emptySansController.GetEmptySansById);
router.post('/empty-sans', emptySansController.CreateEmptySans);
router.put('/empty-sans/:id', emptySansController.UpdateEmptySans);
router.delete('/empty-sans/:id', emptySansController.DeleteEmptySans);

module.exports = router;