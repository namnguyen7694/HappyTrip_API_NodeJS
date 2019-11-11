const mongoose = require('mongoose');
const {SeatSchema} = require('./Seat');

const TripSchema = new mongoose.Schema({
    fromStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    },
    toStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    },
    seats: [SeatSchema],
    startTime: {type: Date, required: true},
    price: {type: Number, required: true}
})

const Trip = mongoose.model('Trip', TripSchema, 'Trip')

module.exports = {Trip, TripSchema}