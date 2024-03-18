const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
    userDate: String,
    userTime: String
})
let userModel = mongoose.model('userdata', userSchema)

const attendanceSchema = new mongoose.Schema({
    uname: String,
    udate: String,
    usignin: String,
    usignout: String,
})

let attendanceModel = mongoose.model('userattendance', attendanceSchema)

const logSchema = new mongoose.Schema({
    uname: String,
    udate : String,
    utime : String
})

let logModel = mongoose.model('userlog', logSchema)

module.exports = {userModel,attendanceModel,logModel}