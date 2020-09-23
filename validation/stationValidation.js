const _ = require('lodash');

module.exports.validateStation = async (req, res, next) =>{
    const {name, address, province} = req.body;
    let errors = {};

    // if(!name) {
    //     errors.name = "Station's name is requied"
    // } 

    if (!address) {
        errors.address = "Address is required"
    }

    if (!province) {
        errors.province = "Province is required"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}

