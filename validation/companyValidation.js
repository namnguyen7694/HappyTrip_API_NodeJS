const _ = require('lodash');

module.exports.validateCompany = async (req, res, next) =>{
    const {name, carType} = req.body;
    let errors = {};

    if(!name) {
        errors.name = "Company's name is requied"
    } 

    if (carType.length === 0) {
        errors.carType = "Cartype is required"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}
