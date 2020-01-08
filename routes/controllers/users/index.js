const express = require('express');
const userController = require('./users');
const {authenticate, authorize} = require ('../../../middlewares/auth');
const {uploadImage} = require ('../../../middlewares/uploadImage');
const router = express.Router();
const {validatePostUser} = require('../../../validation/Users/validate.post.user')
const {validateLoginUser} = require ('../../../validation/Users/validate.login.user')
const {validateUpdateUser} =require ('../../../validation/Users/validate.update.user')

router.post('/',
  validatePostUser,
  userController.createUser);

router.post('/login', 
  validateLoginUser, 
  userController.login); 
router.get('/logout', authenticate, userController.logOut)

router.get('/',authenticate, userController.getUsers);

router.get('/:id',userController.getUserById);

router.put('/:id', 
  validateUpdateUser, 
  authenticate, 
  authorize(["admin"]), 
  userController.updateUserById );

router.delete('/:id',
  authenticate, 
  authorize(["admin"]), 
  userController.deleteUserById );

//upload avatar
router.post('/upload-avatar', 
  authenticate, 
  uploadImage('avatar'),    //key avatar la name cua input trong body
  userController.uploadAvatar)

// test private
router.get('/private', authenticate, authorize(["admin", "client"]), userController.testPrivate);


module.exports = router;