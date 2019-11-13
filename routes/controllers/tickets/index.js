const express = require('express');
const ticketController = require ('./tickets')
const router = express.Router();
const {authenticate, authorize} = require ('../../../middlewares/auth');

router.post('/booking', 
    authenticate, 
    // authorize(["client"]), 
    ticketController.createTicket)
module.exports = router;