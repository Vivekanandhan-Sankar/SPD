const loan = require("../Models/Loan");

exports.updateApproval=(req,res,next)=>{ 
    console.log(req.params.id);
    const _id = req.params.id;
    loan.findOneAndUpdate({firstName:_id},{
        $set:{
            status:req.body.status,
        }
    }).then(result => {
        res.status(200).json({
            message:"updated",
            accounts: result
        })
    }).catch(error =>{
        res.status(500).json({
            message:"error in database",
            error:error
        })
    })
}
exports.getPending = (req,res) =>{
    const statuss = req.params.status;
    loan.find({status: statuss}).then(result => {
        res.status(200).json({
            message: "account found",
            accounts: result
        });
    }).catch(error =>{
        res.status(500).json({
            message:"error in database",
            error: error
        });
    });
};