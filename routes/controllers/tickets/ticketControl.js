const {Ticket} =require ('../../../models/Ticket');
const {User} = require('../../../models//User');
const {Trip} = require ('../../../models/Trip');
const {sendBookingTicketEmail} = require('../../../services/email/sendBookingTicket');
module.exports.createTicket = (req, res, next) =>{
    const {tripId, seatCodes} = req.body;
    const user = req.user  //token

    Trip.findById(tripId)
        .populate("fromStation") //xuat thong tin Obj ID sang text
        .populate("toStation")
        .then(trip =>{
            if (!trip) return Promise.reject({status : 404 , message: "trip not found"})  //viet trong validate
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
                user,  //set default vi chua co token userId
                seats : seatCodes.map( seat => ({
                    isBooked : true,   //ghế đã được book trong vé
                    code: seat
                })),
                totalPrice : trip.price * seatCodes.length
            })
            //chuyển trạng thái của ghế trong trip để không book được 
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