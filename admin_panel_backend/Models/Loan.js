const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoanSchema = new Schema(
    {
        firstName : {
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
        accountNo:{
            type:String,
            required:true
        },
        mobileno:{
            type:String,
            required:true
        }
    }
)

module.exports = mongoose.model('Loan',LoanSchema,'loans');