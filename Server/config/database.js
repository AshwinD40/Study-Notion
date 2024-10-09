const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL,)

    .then(()=>{console.log("DB connected Successfully")})
    .catch((err)=>{
        console.log("DB connection failed")
        console.log(err)
        process.exit(1)
    })
}