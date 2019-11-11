const _ = require('lodash');

module.exports.validatePostStation = async (req, res, next) =>{
    const {name, address, province} = req.body;
    let errors = {};

    if(!name) {
        errors.name = "Station's name is requied"
    } 

    if (!address) {
        errors.address = "address is required"
    }

    if (!province) {
        errors.province = "province is required"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}