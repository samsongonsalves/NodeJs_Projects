const express = require("express")
const app = express()
const mongoose = require('mongoose')
const {userModel, attendanceModel, logModel} = require('./model/model');
const notifier = require('node-notifier');
var date = new Date();
let month = date.getMonth()+1
var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
var current_date = date.getDate()+"-"+ month +"-"+ date.getFullYear();
require('dotenv').config()

mongoose.connect(process.env.connect_link)
.then(()=>{console.log("Database Connected")})
.catch((error)=>{console.log(error)})

app.use(express.urlencoded({ extended: false }))
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('signin')
})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

// Sign In Request

app.post("/verify",(req,res)=>{
    var username = req.body.username;
    let userpassword = req.body.password;
    userModel.findOne({userName:username}).then((z)=>{
        try{
            if(username == 'admin' && userpassword == 'admin'){
                res.redirect('/admin_report')
            }
            else{
                if(z.userName == username){
                    if(z.userPassword != userpassword){
                        notifier.notify({
                            title: 'Incorrect Password!',
                            message: 'The password you entered was Incorrect!',
                        })
                        res.redirect("/")
                    }
                    else{
                        let logdata = new logModel({
                            uname: username,
                            udate: current_date,
                            utime: current_time
                        })
                        logdata.save().then(()=>{
                            res.render("attendance")
                        }).catch((error)=>{console.log(error)})
                    }
                }
            }
        }
        catch(error){
            console.log(`Catch Error: ${error}`);
            notifier.notify({
                title: 'Incorrect Name!',
                message: 'The Username you entered was Incorrect!'
            })
            res.redirect("/");
        }

    })
})

// Sign Up Request

app.post("/signup",(req,res)=>{
    let userdata = new userModel({
        userName: req.body.username,
        userEmail: req.body.useremail,
        userPassword: req.body.userpassword,
        userDate: current_date,
        userTime: current_time
    })
    userdata.save().then((mongodata)=>{
        res.redirect("/");
    }).catch((err)=>{
        console.log(err)
    })
})

// User Report

app.get('/user_report',(req,res)=>{
    attendanceModel.find().then((data)=>{
        let a= 0;
        logModel.find().sort({utime:-1}).limit(1).then((dat)=>{
            let fdata = data.filter(d=>{d.uname == dat.u});
            res.render('user_report',{record:fdata,a:a})
        })
    });
})

// Admin Report

app.get('/admin_report',(req,res)=>{
    userModel.find().then((data)=>{
        let a= 0;
        res.render('admin_report',{record:data,a:a})
    });
})

// Attendance Register

app.post("/attendance",(req,res)=>{
    logModel.findOne().sort({utime:-1}).limit(1).then((d)=>{
        let attendancedata = new attendanceModel({
            uname: d.uname,
            udate: current_date,
            usignin: req.body.signin,
            usignout: req.body.signout
        })
        attendancedata.save().then((mongodata)=>{
            console.log(mongodata)
            res.render("attendance")
        })
    })
})

app.listen(process.env.port)