const express = require('express');
const stationController = require('./stations');
const {authenticate, authorize} = require ('../../../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, authorize(["admin"]), stationController.createStation)
router.get('/', stationController.getStations)
router.get('/:id',stationController.getStationById )
router.put('/:id', authenticate, authorize(["admin"]), stationController.updateStationById)
router.delete('/:id',  authenticate, authorize(["admin"]), stationController.deleteStationById)

module.exports = router;