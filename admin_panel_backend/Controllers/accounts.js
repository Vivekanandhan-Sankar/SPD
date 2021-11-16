const Account = require('../Models/Account');

exports.getPending = (req,res) =>{
    const statuss = req.params.status;
    Account.find({status: statuss}).then(result => {
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

exports.updateApproval=(req,res)=>{ 
    console.log(req.params.id);
    console.log(req.body.balance);
    console.log(req.body.accountNo);
    const ids = req.params.id;
    Account.findOneAndUpdate({firstName:ids},{
        $set:{
            status:req.body.status,
            accountNo:req.body.accountNo,
            balance:req.body.balance,
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

exports.deposit=(req,res)=>{ 
    console.log(req.body.balance);
    const ids = req.params.id;
    Account.findOneAndUpdate({firstName:ids},{
        $set:{
            balance:req.body.balance
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
