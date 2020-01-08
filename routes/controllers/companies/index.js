const express = require('express');
const companyController = require('./companies');
const {authenticate, authorize} = require ('../../../middlewares/auth');
const {validateCompany} = require ('../../../validation/companyValidation')
const router = express.Router();

router.post('/',authenticate, authorize(["admin"]), validateCompany, companyController.createCompany)
router.get('/', companyController.getCompanies)
router.get('/:id', companyController.getCompanyById )
router.get('/:fromStation/:toStation', companyController.getAdviseCompany )
router.put('/:id', authenticate, authorize(["admin"]), validateCompany, companyController.updateCompanyById)
router.delete('/:id',  authenticate, authorize(["admin"]), companyController.deleteCompanyById)

module.exports = router;