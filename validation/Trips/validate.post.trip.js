const _ = require('lodash');

module.exports.validatePostStation = async (req, res, next) =>{
    const {fromStation, toStation, startTime, price} = req.body;
    let errors = {};

    if(!fromStation) {
        errors.fromStation = "Start station is requied"
    } 
    if(!toStation) {
        errors.toStation = "End station is requied"
    }

    if (!startTime) {
        errors.startTime = "startTime is required"
    }

    if (!price) {
        errors.price = "price is required"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}