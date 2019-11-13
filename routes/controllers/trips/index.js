const express = require('express');
const tripController = require('./trips');
const {authenticate, authorize} = require ('../../../middlewares/auth');

const router = express.Router();

router.post('/',  authenticate, authorize(["admin"]), tripController.createTrip)
router.get('/', tripController.getTrips)
router.get('/:id',tripController.getTripById )
router.put('/:id', authenticate, authorize(["admin"]),tripController.updateTripById)
router.delete('/:id',authenticate, authorize(["admin"]), tripController.deleteTripById)

module.exports = router;