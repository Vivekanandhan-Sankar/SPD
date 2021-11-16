require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
//
const md5 = require("md5")
// const encrypt = require("mongoose-encryption");
// const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "our secret",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

// //Vivek's Database
mongoose.connect("mongodb+srv://vivek:V%402211@cluster0.gfqm8.mongodb.net/vivekSPD?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//
// // MY local Database
// mongoose.connect("mongodb://localhost:27017/bankuserDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// mongoose.set("useCreateIndex", true);


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/mainfront",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));


app.get('/', function(req, res) {
  res.sendFile(__dirname + "/front.html");
});

//google signin//
app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  }))

//after selecting google account It has to get in to our mainpage//
app.get("/auth/google/mainfront",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    // Successful authentication, redirect to mainfront.
    res.redirect("/mainfront");
  });



app.get("/register", function(req, res) {
  res.sendFile(__dirname + "/register.html");
});

app.post("/register", function(req, res) {

  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/mainfront");
      });
    }
  });

});

app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/mainfront");
      });
    }
  });
});


app.get("/mainfront", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("cus_main");
  } else {
    res.redirect("/login");
  }
});




app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});



/// Customer functions///

const accountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  acc_email: String,
  address: String,
  address2: String,
  mobileno: String,
  country: String,
  state: String,
  zip: Number(),
  status: String,
  accountNo: String,
  amount: Number(),
  balance: String
});


const Account = new  mongoose.model("Account", accountSchema);


app.get("/create_account", function(req,res){
  res.render("cus_cr_acc");
});

app.post("/create_account", function(req, res){
  const newAccount = new Account({
    firstName: req.body.fstname,
    lastName: req.body.lastname,
    username: req.body.username,
    acc_email: req.body.acc_email,
    address: req.body.address,
    address2: req.body.address2,
    mobileno: req.body.mobileno,
    country: req.body.country,
    state: req.body.state,
    zip: req.body.zip,
    status: "pending",
    accountNo: " ",
    balance: "0"
  });

  newAccount.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/balanceenquiry");
    }
  });

});

app.get("/balanceenquiry",function(req, res){
  res.render("bae");
  // Account.find({}, function(err, foundAccount){
  //   if(foundAccount){
  //     res.render("bae", {account: foundAccount});
  //   }else{
  //     console.log(err);
  //   }
  // })
});

app.post("/balanceenquiry",function(req, res){
  Account.findOne({username: req.body.username}, function(err, foundAccount){
    if(foundAccount){
       res.render("balance", {account: foundAccount})
    }else{
      res.redirect("/balanceenquiry")
      console.log(err);
    }
  })
});


app.post("/delete", function(req, res){
  Account.findOneAndDelete({firstName: req.body.btn}, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/balanceenquiry");
    }
  })
});



/// atm

const Atm = new  mongoose.model("Atm", accountSchema);

app.get("/atm",function(req, res){
  res.render("atm");
});

app.post("/atm", function(req, res){
  const newAtm = new Atm({
    firstName: req.body.fstname,
    lastName: req.body.lastname,
    accountNo: req.body.accountno,
    mobileno: req.body.mobileno,
    username: req.body.username,
    acc_email: req.body.acc_email,
    address: req.body.address,
    address2: req.body.address2,
    country: req.body.country,
    state: req.body.state,
    zip: req.body.zip,
    status: "pending"

  });

  Account.findOne({accountNo: req.body.accountno}, function(err,foundAccount){
    if(foundAccount){
      newAtm.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.redirect("/mainfront");
        }
      });
    }else{
      res.redirect("/atm")
    }
  });
})


app.get("/atmf", function(req, res){
  res.render("atmf");
});


app.post("/atmf",function(req, res){
  Account.findOne({username: req.body.username}, function(err, foundAccount){
    if(foundAccount){
       res.render("atmfin", {account: foundAccount})
    }else{
      res.redirect("/atmf")
      console.log(err);
    }
  })
});

///Apply loan//

const Loan = new mongoose.model("Loan", accountSchema);


app.get("/applyloan",function(req, res){
  res.render("applyloan.ejs");
});

app.post("/applyloan", function(req, res){
  const newLoan = new Loan({
    firstName: req.body.fstname,
    lastName: req.body.lastname,
    accountNo: req.body.accountno,
    mobileno: req.body.mobileno,
    username: req.body.username,
    amount: req.body.amount,
    address: req.body.address,
    address2: req.body.address2,
    country: req.body.country,
    state: req.body.state,
    zip: req.body.zip,
    status: "pending"

  });

  Account.findOne({accountNo: req.body.accountno}, function(err,foundAccount){
    if(foundAccount){
      newLoan.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.redirect("/mainfront");
        }
      });
    }else{
      res.redirect("/applyloan")
    }
  });
});

//loan//
app.get("/finloan", function(req, res){
  res.render("finloan");
});

app.post("/finloan",function(req, res){
  Loan.findOne({username: req.body.username}, function(err, foundAccount){
    if(foundAccount){
       res.render("loan", {account: foundAccount})
    }else{
      res.redirect("/finloan")
      console.log(err);
    }
  });
});
// app.get("/:postName", function(req, res){
//   const requestedTitle = req.params.postName;
//   Account.find({}, function(err, list){
//     list.forEach(function(account){
//       const storedTitle = .title;
//       const storedContent = note.content;
//       if(lodash.lowerCase(storedTitle) === lodash.lowerCase(requestedTitle)){
//          res.render("details", {Title: storedTitle, noteContent: storedContent});
//       }
//     })
//   })
// })


/// transaction///


app.get("/transaction", function(req, res){
  res.render("transaction");
});







/// send money ///

const transactionSchema = new mongoose.Schema({
  senderfirstName: String,
  senderlastName: String,
  receiverfirstName: String,
  receiverlastName: String,
  sender_username: String,
  receiver_accountno: String,
  sending_amount: String
});

const Transaction = new mongoose.model("Transaction", transactionSchema);

app.get("/send", function(req, res){
  res.render("sendmoney");
});


app.post("/send", function(req, res){

Account.findOne({username: req.body.username}, function(err, foundsenderAccount){
  if(foundsenderAccount){
    console.log(parseInt(foundsenderAccount.balance));
    Account.findOne({accountNo: req.body.accountno}, function(err, foundreceiverAccount){
      if(foundreceiverAccount){
        console.log(foundreceiverAccount.balance);
      }
    })
  }else{
    console.log(err);
  }
})
});


app.listen(3000, function() {
  console.log("server started on port 3000..");
});






///upto bcrypt for register///
// bcrypt.hash(req.body.password, saltRounds, function(err,hash){
//   const newUser = new User({
//     email:req.body.email,
//     password:hash
//   });
//   newUser.save(function(err){
//     if(err){
//       console.log(err);
//     }else{
//       res.render("mainfront");
//     }
//   });
// })




///upto bcrypt for login///
// const useremail = req.body.email;
// const password = req.body.password;
// User.findOne({email: useremail}, function(err,foundUser){
//   if(err){
//     console.log(err);
//   }else{
//     if(foundUser){
//       bcrypt.compare(password, foundUser.password, function(err, result){
//         if(result === true){
//           res.render("mainfront");
//         }
//       });
//     }
//   }
// });




//// PIN WORKS AND INNER SITE WORKS ////
//
// const pinSchema = new mongoose.Schema({
//   pin: Number()
// });
//
// const Cuspin = new mongoose.model("Cuspin", pinSchema);
// const Empin = new mongoose.model("Empin", pinSchema);
// const Manpin = new mongoose.model("Manpin", pinSchema);
//
// //Customer//
//
// app.get("/cus_pin_login", function(req, res) {
//   res.render("cus_pin_login");
// });
//
//
// app.post("/cus_pin_login", function(req, res) {
//   const cuspin = md5(req.body.cuspin);
//   Cuspin.findOne({
//     pin: cuspin
//   }, function(err, foundPin) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundPin) {
//         if (cuspin === foundPin.pin) {
//           res.render("cus_main");
//         }
//       } else {
//         res.redirect("/cus_pin_login");
//       }
//     }
//   })
//
// });
//
// app.get("/cus_createpin", function(req, res) {
//   res.render("cus_createpin");
// });
//
// app.post("/cus_createpin", function(req, res) {
//   const newPin = new Cuspin({
//     pin: md5(req.body.cuspin)
//   });
//   console.log(newPin);
//   newPin.save(function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("cus_main");
//     }
//   });
// });
//
//
//
// //Employee//
// app.get("/em_pin_login", function(req, res) {
//   res.render("em_pin_login");
// });
//
//
// app.post("/em_pin_login", function(req, res) {
//   const empin = md5(req.body.empin);
//   Empin.findOne({
//     pin: empin
//   }, function(err, foundPin) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundPin) {
//         if (empin === foundPin.pin) {
//           res.render("emp_main");
//         }
//       } else {
//         res.redirect("/em_pin_login");
//       }
//     }
//   })
//
// });
//
// app.get("/em_createpin", function(req, res) {
//   res.render("em_createpin");
// });
//
// app.post("/em_createpin", function(req, res) {
//   const newPin = new Empin({
//     pin: md5(req.body.empin)
//   });
//   console.log(newPin);
//   newPin.save(function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("emp_main");
//     }
//   });
// });
//
//
//
// /// Manager///
// app.get("/man_pin_login", function(req, res) {
//   res.render("man_pin_login");
// });
//
//
// app.post("/man_pin_login", function(req, res) {
//   const manpin = md5(req.body.manpin);
//   Manpin.findOne({
//     pin: manpin
//   }, function(err, foundPin) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundPin) {
//         if (manpin === foundPin.pin) {
//           res.render("man_main");
//         }
//       } else {
//         res.redirect("/man_pin_login");
//       }
//     }
//   })
//
// });
//
// app.get("/man_createpin", function(req, res) {
//   res.render("man_createpin");
// });
//
// app.post("/man_createpin", function(req, res) {
//   const newPin = new Manpin({
//     pin: md5(req.body.manpin)
//   });
//   console.log(newPin);
//   newPin.save(function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("man_main");
//     }
//   });
// });
//




//
//
// Account.findOne({username: req.body.username}, function(err, foundsenderAccount){
//   if(foundsenderAccount){
//     Account.findOne({accountNo: req.body.accountno}, function(err,foundreceiverAccount){
//       if(foundreceiverAccount){
//         const newTransaction = new Transaction({
//           senderfirstName: foundsenderAccount.firstName,
//           senderlastName : foundsenderAccount.lastName,
//           receiverfirstName : foundreceiverAccount.firstName,
//           receiverlastName : foundreceiverAccount.lastName,
//           sender_username: req.body.username,
//           receiver_accountno: req.body.accountno,
//           sending_amount: req.body.amount
//         });
//
//         newTransaction.save(function(err){
//           if(err){
//             console.log(err);
//           }else{
//             res.redirect("/mainfront")
//             Account.findOneAndUpdate({accountNo: req.body.accountno}, {$set:{balance: parseInt(foundreceiverAccount.balance) + parseInt(req.body.amount)}});
//           }
//         });
//       }else{
//         res.redirect("/send");
//       }
//     });
//   }else{
//     res.redirect("/send");
//   }
// });
