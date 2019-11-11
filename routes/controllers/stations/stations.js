const {Station} = require ('../../../models/Station');

//create Station
module.exports.createStation = (req, res,next) => {
    const {name, address, province} = req.body;
    const newStation = new Station({name, address, province})
    newStation.save()
        .then(station => res.status(201).json(station))
        .catch(err => res.status(500).json(err))
}
//get all stations
module.exports.getStations = (req,res,next) => {
    Station.find()
    .then(stations => res.status(200).json(stations))  //status 200 getted
    .catch(err => res.status(500).json(err))
}
//get 1 station by ID
module.exports.getStationById = (req,res,next) => {
    const {id} = req.params;  //object co cac thuoc tinh truyen vao khi get
    Station.findById(id)
    .then(station => res.status(200).json(station))
    .catch(err => res.status(500).json(err))
}
//update 1 station by ID
module.exports.updateStationById = (req,res,next) => {
    const {id} = req.params;
    const {name, address, province} = req.body;
    Station.findById(id)
        .then(station => {
            if(!station) return Promise.reject({
                status: 404, message: "Not found"
            })
            station.name = name;
            station.address = address;
            station.province = province;
            return station.save()
        })
        .then(station => res.status(200).json(station))
        .catch(err => {
            if (err.status) return res.status(err.status).json({message: err.message})
            return res.status(500).json(err)
        })
}

//delete 1 station by ID
module.exports.deleteStationById = (req,res,next) => {
    const {id} = req.params;  //object co cac thuoc tinh truyen vao khi get
    Station.deleteOne({_id: id})   //delete truyen vao Obj Id
    .then( () => res.status(200).json({message: "delete sucess"}))
    .catch(err => res.status(500).json(err))
}