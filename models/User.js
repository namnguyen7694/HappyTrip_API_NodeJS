const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { promisify } = require('util'); // built-in nodejs

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password : {type: String, required: true},
    fullName : {type: String, required: true},
    userType : {type: String, default : "client"},
    avatar: { type: String }
})

const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);

UserSchema.pre("save", function (next) {
  console.log(this);
  const user = this;

  if (!user.isModified("password")) return next();   //nếu không đổi password thì chạy tiếp không cần hash pw

  genSalt(10)
    .then(salt => {
      return hash(user.password, salt)
    })
    .then(hash => {
      user.password = hash;
      next();
    })
})


const User = mongoose.model('User', UserSchema, 'User')

module.exports = {User, UserSchema}