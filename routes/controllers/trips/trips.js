const {Trip} = require('../../../models/Trip') ;
const {Seat} = require('../../../models/Seat');
const carTypes = require('../companies/carTypes.json');

//create Trip
module.exports.createTrip = (req, res, next) => {
    const {fromStation, toStation, startTime, company, carType, price} = req.body;
    let seatCodes = [];
    for (let types of carTypes) {
        if (types.carType === carType) {
            seatCodes = types.seats
        } 
    };
    ;
    let seats = [];
    seatCodes.forEach( code => {
        const seat = new Seat({code , isBooked : false})
        seats.push(seat);
    })
    
    const newTrip = new Trip({fromStation, toStation, seats, startTime,company, carType, price})
    newTrip.save()
        .then(trip => res.status(201).json(trip)) //status 201 created --> send JSON respone
        .catch(err => res.status(500).json(err))
}

//get all trips
module.exports.getTrips = (req,res,next) => {
    Trip.find()
    .populate("fromStation", "name province")
    .populate("toStation", "name province")
    .populate("company", "name image -_id")
    .then(trips => res.status(200).json(trips))  //status 200 getted
    .catch(err => res.status(500).json(err))
}

//get 1 trip by ID
module.exports.getTripById = (req,res,next) => {
    const {id} = req.params;  //object co cac thuoc tinh truyen vao khi get
    Trip.findById(id)
    .populate("fromStation", "name")
    .populate("toStation", "name")
    .populate("company", "name image")
    .then(trip => res.status(200).json(trip))
    .catch(err => res.status(500).json(err))
}

// search Trip
module.exports.getAdviseTrip = (req, res, next) => {
    
}

//update trip by ID
module.exports.updateTripById = (req,res,next) => {
    const {id} = req.params;
    const {fromStation, toStation, startTime, company, carType, price} = req.body;
    Trip.findById(id)
        .then(trip => {
            if(!trip) return Promise.reject({
                status: 404, message: "Not found"
            })
            trip.fromStation = fromStation;
            trip.toStation = toStation;
            trip.startTime = startTime;
            trip.company = company;
            trip.carType = carType;
            trip.price = price;
            return trip.save()
        })
        .then(trip => res.status(200).json(trip))
        .catch(err => {
            if (err.status) return res.status(err.status).json({message: err.message})
            return res.status(500).json(err)
        })
}

//delete 1 Trip by ID
module.exports.deleteTripById = (req,res,next) => {
    const {id} = req.params;  //object co cac thuoc tinh truyen vao khi get
    Trip.deleteOne({_id: id})   //delete truyen vao Obj Id
    .then( () => res.status(200).json({message: "delete sucess"}))
    .catch(err => res.status(500).json(err))
}