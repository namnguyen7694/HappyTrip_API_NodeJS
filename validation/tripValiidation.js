const _ = require('lodash');

module.exports.validateTrip = async (req, res, next) =>{
    const { fromStation, toStation, company, carType, startTime, price} = req.body;
    let errors = {};

    if (!fromStation) {
        errors.fromStation = "Start Station is required"
    }
    if (!toStation) {
        errors.toStation = "End Station is required"
    }
    if (!company) {
        errors.company = "company is required"
    }
    if (!carType) {
        errors.carType = "Car Type is required"
    }
    if (!startTime) {
        errors.startTime = "StartTime is required"
    }

    if (!price) {
        errors.price = "Price is required"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}
