const express = require('express');
const ticketController = require ('./tickets')
const router = express.Router();
const {authenticate, authorize} = require ('../../../middlewares/auth');

router.post('/booking', 
    authenticate, 
    // authorize(["client"]), 
    ticketController.createTicket);

router.get('/', authenticate, ticketController.getTickets)

module.exports = router;