const {Station} = require ('../../../models/Station');
const {Company} = require ('../../../models/Company');
const mongoose = require('mongoose');

//create Station
module.exports.createStation = (req, res,next) => {
    const {name, address, province, image, companies} = req.body;
    const newStation = new Station({name, address, province, image, companies})
    newStation.save()
        .then(station => {
            companies.forEach(companyId => {
                Company.findById(companyId).then(company => {
                    company.stations.push(station._id);
                    company.save()
                })
            })
            res.status(201).json(station)
        })
        .catch(err => res.status(500).json(err))
}
//get all stations
module.exports.getStations = (req,res,next) => {
    Station.find()
    .populate("companies", "name")
    .then(stations => res.status(200).json(stations))  
    .catch(err => res.status(500).json(err))
}
//get 1 station by ID
module.exports.getStationById = (req,res,next) => {
    const {id} = req.params; 
    Station.findById(id)
    .populate("companies", "name")
    .then(station => res.status(200).json(station))
    .catch(err => res.status(500).json(err))
}
//update 1 station by ID
module.exports.updateStationById = (req,res,next) => {
    const {id} = req.params;
    const {name, address, province, image, companies} = req.body;
    Station.findById(id)
        .then(station => {
            if(!station) return Promise.reject({
                status: 404, message: "Station Not found"
            });
            
            const oldCompanies = station.companies;     
            const newCompanies = companies;

            const addedCompanies = newCompanies.filter(com => oldCompanies.indexOf(com) === -1);
            const removedCompanies = oldCompanies.filter(com => newCompanies.indexOf(com._id.toString()) === -1);
            
            if (removedCompanies) {
                removedCompanies.forEach(companyId => {
                  Company.findById(companyId).then(company => {
                    company.stations.splice(company.stations.indexOf(id), 1);
                    company.save();
                  });
                });
            }

            if (addedCompanies) {
              addedCompanies.forEach(companyId => {
                Company.findById(companyId).then(company => {
                  company.stations.push(id);
                  company.save();
                });
              });
            }

            station.name = name;
            station.address = address;
            station.province = province;
            station.image = image;
            station.companies = companies;
            return station.save()
        })
        .then(station => res.status(200).json(station))
        .catch(err => {
            if (err.status) return res.status(err.status).json({message: err.message})
            return res.status(500).json(err)
        })
}

//delete 1 station by ID
module.exports.deleteStationById = async (req,res,next) => {
    const {id} = req.params;
    const station = await Station.findById(id);
    const companies = station.companies;
    
    Station.deleteOne({_id: id})   
    .then( () => {
        companies.forEach(companyId => {
            Company.findById(companyId).then(company => {
                company.stations.splice(company.stations.indexOf(id), 1);
                company.save();
            });
        })
        res.status(200).json({message: "delete sucess"})
    })
    .catch(err => res.status(500).json(err))
}