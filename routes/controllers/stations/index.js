const express = require('express');
const stationController = require('./stations');
const {authenticate, authorize} = require ('../../../middlewares/auth');
const {validateStation} = require ('../../../validation/stationValidation')
const router = express.Router();

router.post('/', authenticate, authorize(["admin"]), validateStation, stationController.createStation)
router.get('/', stationController.getStations)
router.get('/:id',stationController.getStationById )
router.put('/:id', authenticate, authorize(["admin"]), validateStation, stationController.updateStationById)
router.delete('/:id',  authenticate, authorize(["admin"]), stationController.deleteStationById)

module.exports = router;