const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {type: String, required: true},
    carType: [{
        type: String,
        required: true
    }],
    stations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    }]
})

const Company = mongoose.model('Company', CompanySchema, 'Company')

module.exports = {Company, CompanySchema}