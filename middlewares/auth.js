const jwt= require('jsonwebtoken');
const {promisify} = require ('util');   //import dang object khi dung moduel.exports.obj

const verifyJwt = promisify(jwt.verify);
const keys = require ('../config/index')

module.exports.authenticate =  (req, res, next) => {
    const token = req.header("token");
    verifyJwt(token, keys.secret_key)
        .then(decoded => {
            if (decoded) {
                req.user = decoded     //tra ve req cho mdw tiep theo su dung
                return next() 
            }
        })
        .catch(() => res.status(401).json({ message: "User is not authentecated" })
        )
}

// 1 mang cac loai user de so sanh
module.exports.authorize = (userTypeArr) => {
    return (req, res, next) => {
        const {user} = req;       //req của mdw trước trả về
        
        if (userTypeArr.findIndex(elm => elm === user.userType) > -1) return next();
        // if (userType === user.userType) return next();
        return res.status(403).json({message: "Access denied"})
    }

}

