const express=require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require('./Routes/routes');

const app=express();

const port= 2555 ;
const host ="0.0.0.0";
app.use(express.json());
app.use(bodyParser.json());


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/',routes);

mongoose.connect(
    'mongodb+srv://vivek:V%402211@cluster0.gfqm8.mongodb.net/vivekSPD?retryWrites=true&w=majority',
    {
       useNewUrlParser:true,
       useUnifiedTopology:true 
    }
).then(result=>{ 
    console.log("Connected");
    app.listen(port,host,()=>{
        console.log(`Server is running on ${port}`);
        
    });
}).catch(error=>{
    console.log("Error in Database"+error);
});