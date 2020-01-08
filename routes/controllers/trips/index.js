const express = require('express');
const tripController = require('./trips');
const {authenticate, authorize} = require ('../../../middlewares/auth');
const {validateTrip} = require ('../../../validation/tripValiidation')

const router = express.Router();

router.post('/',  authenticate, authorize(["admin"]), validateTrip, tripController.createTrip)
router.get('/', tripController.getTrips)
router.get('/:id',tripController.getTripById )
router.get('/:fromStation/:toStation/:startTime', tripController.getAdviseTrip)
router.put('/:id', authenticate, authorize(["admin"]), validateTrip, tripController.updateTripById)
router.delete('/:id',authenticate, authorize(["admin"]), tripController.deleteTripById)

module.exports = router;