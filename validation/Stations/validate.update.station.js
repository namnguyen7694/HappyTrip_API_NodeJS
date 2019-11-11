const _ = require('lodash');
const {Station} = require ('../../models/Station');

module.exports.validateUpdateStation = async (req, res, next) =>{
    const {name, address, province} = req.body;

    let errors = {};

    //name
    if(!name) {
        errors.name = "Station's name is requied"
    } 

    //address
    if (!address) {
        errors.address = "address is required"
    }

    //province
    if (!province) {
        errors.province = "province is required"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}