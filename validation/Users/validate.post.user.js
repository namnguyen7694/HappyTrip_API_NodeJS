const _ = require('lodash');
const validator = require('validator');
const {User} = require ('../../models/User');

module.exports.validatePostUser = async (req, res, next) =>{
    const {email, password, password2, fullName} = req.body;
    let errors = {};

    if(!email) {
        errors.email = "Chưa nhập thông tin Email"
    } else if (!validator.isEmail(email)) {
        errors.email = "Email không hợp lệ"
    } else {
        const user = await User.findOne({email});
        if (user) errors.email = "Email đã tồn tại"
    }

    if (!password) {
        errors.password = "Chưa nhập mật khẩu"
    }
    else if(!validator.isLength(password, {min:6})) {
        errors.password = "Mật khẩu tối thiểu 6 ký tự"
    }

    if (!password2) {
        errors.password2 = "Chưa xác nhận lại mật khẩu"
    } else if(!validator.equals(password,password2)) {
        errors.password2 = "Mật khẩu không trùng khớp"
    }

    if (!fullName) {
        errors.fullName = "Chưa nhập thông tin họ tên"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}