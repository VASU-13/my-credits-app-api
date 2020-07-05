const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const mongoose = require("mongoose");

const User = require("./user");
const Transfer    = require("./records.js")

/*var distDir = __dirname + "/dist/manage-credit";
app.use(express.static(distDir));
app.use('/',express.static(distDir));
app.use(favicon(__dirname + '/public/img/favicon.ico'));*/




app.use((req,res,next) => {

  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();

});






mongoose.connect("mongodb+srv://main:h7VDExkEKkzTCX7c@cluster0-bzyel.mongodb.net/manageCredit?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true } )
.then(()=>{
  console.log("Connected To DB");
})
.catch(() => {
  console.log("Connection Failed");

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.get("/transferRecords", (req, res, next) => {
  Transfer.find().then(documents => {
    res.status(200).json({
      message:"Data Fetched Successfully",
      user: documents
    });
  });
});




app.post("/transferRecords",(req, res,next) =>{
  const transfer = new Transfer({
    to: req.body.to,
    from: req.body.from,
    credit: req.body.credit

  });
  transfer.save();
  res.status(200).json({
    message: " Post Successfully",
  });
    

  
});






app.put("/users", (req, res, next) => {


    const fromUser = new User({
      _id: req.body.from._id,
      name: req.body.from.name,
      email: req.body.from.email,
      credit: Number(req.body.from.credit) - Number(req.body.transfer.credit)

    })

    const toUser = new User({
      _id: req.body.to._id,
      name: req.body.to.name,
      email: req.body.to.email,
      credit: Number(req.body.to.credit) + Number(req.body.transfer.credit)

    })
    User.updateOne({ name: req.body.to.name }, toUser).then(result => {
      //console.log(result);

    });
    User.updateOne({ name: req.body.from.name }, fromUser).then(result => {
      res.send({
        fu: fromUser,
        tu: toUser
      })
    })


  
  });




app.get("/users" , (req,res,next) => {
  User.find().then(documents =>{
    res.status(200).json({
      message: "Data Fetched Successfully",
      user:documents
    });
  });
});


module.exports = app;