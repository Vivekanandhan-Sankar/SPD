const express=require('express');
const router=express.Router();

const userController = require('../Controllers/User');
const accountController = require('../Controllers/accounts')
const atmController = require('../Controllers/atm')
const loancontroller = require('../Controllers/loan')

router.post('/userSignUp', userController.signUp);
router.post('/userLogin', userController.login);

router.get('/accounts/:status',accountController.getPending);
router.get('/cards/:status',atmController.getPending);
router.get('/loans/:status',loancontroller.getPending);

router.put('/updateAccount/:id',accountController.updateApproval);
router.put('/deposit/:id',accountController.deposit);
router.put('/updateCard/:id',atmController.updateApproval);
router.put('/updateLoan/:id',loancontroller.updateApproval);

module.exports=router;