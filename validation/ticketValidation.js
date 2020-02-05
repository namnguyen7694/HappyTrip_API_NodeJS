const _ = require('lodash');

module.exports.validationTicket = async (req, res, next) =>{
    const { seatCodes} = req.body;
    let errors = {};

    if (seatCodes.length === 0) {
        errors.fromStation = "Seat is required"
    }
    
    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}
