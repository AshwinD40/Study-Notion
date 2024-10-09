const express = require("express");
const app = express();

const userRoute = require('./routers/user');
const profileRoute = require('./routers/profile');
const courseRoute = require('./routers/course');
const paymentRoute = require('./routers/payment');
const ContactRoute = require('routers/Contact')

const database = require('./config/database');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 3000

// connect with database
database.connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/",
    })
)

// connection with cloudinary
cloudinaryConnect();

// routes
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/contact', ContactRoute)

// app.get default route
app.get("/", (req , res)=>{
    return res.json({
        success:true,
        message: "Welcome to your server ",
    });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`) 
})