const express = require('express');

const stationRouter = require ('./controllers/stations/index');
const tripRouter = require ('./controllers/trips/index')
const userRouter = require ('./controllers/users/index')
const ticketRouter = require ('./controllers/tickets/index')
const companyRouter = require ('./controllers/companies/index')
const router = express.Router();

router.use('/stations', stationRouter)  // -->controllers/stations/index.js
router.use('/trips', tripRouter)   // -->controllers/trips/index.js
router.use('/users', userRouter)   // -->controllers/users/index.js
router.use('/tickets', ticketRouter)
router.use('/companies', companyRouter)


module.exports = router;