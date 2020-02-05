const {User} = require ('../../../models/User');
const bcrypt = require ('bcryptjs');
const {promisify} = require ('util');   //callback function to Promise
const jwt= require('jsonwebtoken')

const keys = require ('../../../config/index')

const comparePassword = promisify(bcrypt.compare);
const jwtSign = promisify(jwt.sign)

module.exports.createUser = (req, res, next) =>{
    const {email, password, fullName} = req.body;
    const newUser = new User({
        email, password, fullName
    })
    newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => {
        if (err.status) return res.status(err.status).json({message:err.message})
        res.status(500).json(err)
    })
}
module.exports.login = (req, res, next)=>{
    const {email, password} =req.body;
    User.findOne({email})
        .then(user =>{
            if (!user) return Promise.reject({status:404, message: "User not found"})
            return Promise.all([comparePassword(password, user.password), user]) 
        })
        .then(result =>{
            const isMatch = result[0];
            const user =result[1];
            if (!isMatch) return Promise.reject({status:400, message: "Password incorrect"})
            const payload = {
                email : user.email,
                userType : user.userType,
                fullName: user.fullName,
                userId : user._id
            }
            return jwtSign(payload, keys.secret_key, {expiresIn: 3600})
        })
        .then(token => {
            // res.cookie('t', token, {expire: new Date() + 9999})
            res.status(200).json({message: "login success", token})
        })
        .catch(err =>{
            if(!err.status) return res.status(500).json()
            return res.status(err.status).json({message:err.message})
        })    
}


module.exports.uploadAvatar = (req, res, next) => {
    const { email } = req.user;
    User.findOne({ email: email })
      .then(user => {
        user.avatar = req.file.path;
        return user.save()
      })
      .then(user => res.status(200).json(user))
      .catch(err => res.json(err))
  }

 module.exports.getUsers = (req,res,next) => {
    User.find()
    .then(users => res.status(200).json(users))  
    .catch(err => res.status(500).json(err))
}

module.exports.getUserById = (req,res,next) => {
    const {id} = req.params;  
    User.findById(id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
}

module.exports.updateUserById = (req,res,next) => {
    const {id} = req.params;
    const {email, password, fullName, userType} = req.body;
    User.findById(id)
        .then(user => {
            if(!user) return Promise.reject({
                status: 404, message: "User not found"
            })
            user.email = email;
            user.password = password;
            user.fullName = fullName;
            user.userType = userType;

            return user.save()
        })
        .then(user => res.status(200).json(user))
        .catch(err => {
            if (err.status) return res.status(err.status).json({message: err.message})
            return res.status(500).json(err)
        })
}

module.exports.deleteUserById = (req,res,next) => {
    const {id} = req.params;  //object co cac thuoc tinh truyen vao khi get
    User.deleteOne({_id: id})   //delete truyen vao Obj Id
    .then( () => res.status(200).json({message: "delete user sucess"}))
    .catch(err => res.status(500).json(err))
}

