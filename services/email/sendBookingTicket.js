const nodemailer = require ('nodemailer');
const fs = require('fs');
const hogan = require ('hogan.js');
const keys = require('../../config/index')
const template = fs.readFileSync('services/email/bookTicketEmailTemplate.hjs', 'utf-8');  //đường dẫn nhìn từ vị trí run npm debug thư mục root
const compileTemplate = hogan.compile(template)

module.exports.sendBookingTicketEmail = (ticket, trip, user) =>{
    const transport ={
        host : "smtp.gmail.com",
        port : 587,
        secure: false,
        requireTSL : true,
        requireSSL: true,
        auth: {
            user : keys.email,
            pass: keys.password
        }
    }

    const transporter = nodemailer.createTransport(transport)
    const mailOptions = {
        from : keys.email,
        to: user.email,
        subject: "Mail xac nhan mua ve thanh cong",
        html: compileTemplate.render({
            fullName: user.fullName,
            email: user.email,
            fromStation: `${trip.fromStation.name}, ${trip.fromStation.address}`,
            toStation: `${trip.toStation.name}, ${trip.toStation.address}`,
            price: trip.price,
            amount: ticket.seats.length,
            seats: ticket.seats.map(s =>s.code).toString(),
            total: ticket.seats.length*trip.price,
        })
    }

    transporter.sendMail(mailOptions, err =>{
        if (err) return console.log(err.message);
        console.log("Email sent success");
    })
}
