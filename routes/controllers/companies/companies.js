const {Company} = require ('../../../models/Company');
const {Station} = require ('../../../models/Station');

//create Company
module.exports.createCompany = (req, res, next) => {
  const { name, carType, stations, image } = req.body;
  const newCompany = new Company({ name, carType, stations, image });
  
  newCompany
    .save()
    .then(company => {
        stations.forEach(stationId => {
            Station.findById(stationId).then(station => {
                station.companies.push(company._id);
                station.save();
            });
          });
        res.status(201).json(company)
    })
    .catch(err => res.status(500).json(err));
};
//get all Company
module.exports.getCompanies = (req,res,next) => {
    Company.find()
    .populate("stations", "name")
    .then(companies => res.status(200).json(companies)) 
    .catch(err => res.status(500).json(err))
}
//get 1 Company by ID
module.exports.getCompanyById = (req,res,next) => {
    const {id} = req.params;  //object co cac thuoc tinh truyen vao khi get
    Company.findById(id)
    .populate("stations", "name")
    .then(company => res.status(200).json(company))
    .catch(err => res.status(500).json(err))
}

//get advise Company
module.exports.getAdviseCompany = async (req, res, next) => {
    const {fromStation, toStation} = req.params;
    const station1 = await Station.findById(fromStation);
    const fromCompany = station1.companies;
    const station2 = await Station.findById(toStation);
    const toCompany = station2.companies;
    const matchCompanyId = fromCompany.filter(com => toCompany.indexOf(com) > -1);
    Company.find({_id: matchCompanyId})
    .populate("stations", "name")
    .then(companies => res.status(200).json(companies)) 
    .catch(err => res.status(500).json(err))
}

//update 1 Company by ID
module.exports.updateCompanyById = (req,res,next) => {
    const {id} = req.params;
    const {name, carType, stations, image} = req.body;
    Company.findById(id)
        .then(company => {
            if(!company) return Promise.reject({
                status: 404, message: "Not found"
            })

            const oldStations = company.stations;
            const newStations = stations;

            const addedStations = newStations.filter(stt => oldStations.indexOf(stt) === -1);
            const removedStations = oldStations.filter(stt => newStations.indexOf(stt._id.toString()) === -1);
            
            if (removedStations) {
                removedStations.forEach(stationId => {
                  Station.findById(stationId).then(station => {
                    station.companies.splice(station.companies.indexOf(id), 1);
                    station.save();
                  });
                });
            }

            if (addedStations) {
                addedStations.forEach(stationId => {
                  Station.findById(stationId).then(station => {
                    station.companies.push(id);
                    station.save();
                  });
                });
            }

            company.name = name;
            company.image = image;
            company.carType = carType;
            company.stations = stations;
            return company.save()
        })
        .then(company => res.status(200).json(company))
        .catch(err => {
            if (err.status) return res.status(err.status).json({message: err.message})
            return res.status(500).json(err)
        })
}

//delete 1 Company by ID
module.exports.deleteCompanyById = async (req,res,next) => {
    const {id} = req.params;  
    const company = await Company.findById(id);
    const stations = company.stations;

    Company.deleteOne({_id: id})   
    .then( () => {
        stations.forEach(stationId => {
            Station.findById(stationId).then(station => {
                station.companies.splice(station.companies.indexOf(id), 1);
                station.save();
            });
        })
        res.status(200).json({message: "delete sucess"})
    })
    .catch(err => res.status(500).json(err))
}