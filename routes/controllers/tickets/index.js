const express = require('express');
const tiketController = require ('./ticketControl')
const router = express.Router();
const {authenticate, authorize} = require ('../../../middlewares/auth');

router.post('/booking', 
    authenticate, 
    // authorize(["client"]), 
    tiketController.createTicket)
module.exports = router;