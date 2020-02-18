const express = require('express');
const ticketController = require ('./tickets')
const router = express.Router();
const {validationTicket} = require('./../../../validation/ticketValidation')
const {authenticate, authorize} = require ('../../../middlewares/auth');

router.post('/booking', 
    authenticate, 
    authorize(["client"]), 
    validationTicket,
    ticketController.createTicket);

router.get('/', authenticate,  ticketController.getTickets)
router.get('/:id', authenticate,  ticketController.getTicketById)
router.delete('/:id', authenticate, ticketController.deleteTicketById)

module.exports = router;