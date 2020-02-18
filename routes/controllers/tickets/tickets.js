const {Ticket} =require ('../../../models/Ticket');
const {Trip} = require ('../../../models/Trip');
const {sendBookingTicketEmail} = require('../../../services/email/sendBookingTicket');
const _ = require ('lodash')

module.exports.createTicket = (req, res, next) =>{
    const {tripId, seatCodes, info} = req.body;
    const user = req.user  ;

    Trip.findById(tripId)
        .populate("fromStation") 
        .populate("toStation")
        .populate("company")
        .then(trip =>{
            if (!trip) return Promise.reject({status : 404 , message: "trip not found"}) 
            const availableSeatCodes = trip.seats
                .filter(seat => !seat.isBooked)
                .map( seat => seat.code)
            
            let bookedSeatCodes = [];
            seatCodes.forEach( code => {
                if (availableSeatCodes.indexOf(code)=== -1) bookedSeatCodes.push(code);
            })

            if (bookedSeatCodes.length > 0) return Promise.reject({
                status : 400,
                message: "Seats are not available",
                notAvaiSeat: bookedSeatCodes
            })

            const newTicket = new Ticket ({
                tripId,
                userId: user.userId,  
                seats : seatCodes.map( seat => ({
                    isBooked : true,   
                    code: seat
                })),
                phone : info.phone, 
                address: info.address, 
                note: info.note,
                totalPrice : trip.price * seatCodes.length
            })
            
            trip.seats = trip.seats.map ( seat => {
                if (seatCodes.indexOf(seat.code) > -1) {
                    seat.isBooked = true
                }
                return seat;
            })

            return Promise.all([newTicket.save(), trip.save()])

        })
        .then(result => {
            sendBookingTicketEmail(result[0], result[1], req.user)
            res.status(200).json(result[0]);
        })
        .catch((err)=>{
            res.status(400).json({message: err})
        })
}

module.exports.getTickets = (req, res, next) => {
    Ticket.find()
    .populate("userId", "fullName email")
    .populate("tripId", "company toStation fromStation price carType")
    .then( tickets => res.status(200).json(tickets))
    .catch( err => res.status(500).json(err))
};

module.exports.getTicketById = (req, res, next) => {
    const {id} = req.params;
    Ticket.findById(id)
    .populate("userId", "fullName email")
    .populate("tripId", "company toStation fromStation price carType")
    .then(ticket => {
        const trip = Trip.findById(ticket.tripId._id)
            .populate("fromStation", "name province")
            .populate("toStation", "name province")
            .populate("company", "name")
        return Promise.all([ticket, trip])
    })
    .then( result => res.status(200).json(result))
    .catch( err => res.status(500).json(err))
};

module.exports.getMyTickets = (req, res, next) => {
    const user = req.user;
    Ticket.find({userId : user.userId})
        .populate("userId", "fullName email")
        .populate("tripId", "fromStation toStation company price carType")
        .then(tickets => res.status(200).json(tickets)) 
        .catch(err => res.status(500).json(err))
}

module.exports.deleteTicketById = async (req,res,next) => {
    const {id} = req.params; 
    const ticket = await Ticket.findById(id);
    const trip = await Trip.findById (ticket.tripId); 
    const seatCodes = ticket.seats.map(s => s.code);
    
    await Ticket.deleteOne({_id: id})   
    .then( () => {
        trip.seats = trip.seats.map ( seat => {
            if (seatCodes.indexOf(seat.code) > -1) {
                seat.isBooked = false
            }
            return seat;
        })
        trip.save();
        res.status(200).json({message: "Xóa thành công"})
    })
    .catch(err => res.status(500).json(err))
}