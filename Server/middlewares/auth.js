const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models/User');


// auth
exports.auth = async (req, res , next)=>{

    try{
        // extract token
        const token = req.cookies.token || req.body.token || req.header('Authorization').replace('Bearer ', '');

        // if token missing , then return res
        if(!token){
            return res.status(401).json({
                success:false,
                message:'No token provided'
                
            });
        }

        // varify token
        try{
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            console.log(error)
            return res.status(400).json({
                success:false,
                message:'Invalid token',
            })
        }
        next();
    }
    catch(error){
        res.status(401).json({
            success:false,
            message: 'something went wrong while validating the token',
        });
    }
};

// isStudent
exports.isStudent = async (req, res , next)=>{
    try{

        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message: 'You are not a student',
            });
        }
        next();

    }catch(error){
        res.status(500).json({
            success:false,
            message:"User role can not verified , please try again later",
        })

   }
}
// isInstructor
exports.isInstructor = async (req, res , next)=>{
    try{

        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message: 'You are not a Instructor',
            });
        }
        next();

    }catch(error){
        res.status(500).json({
            success:false,
            message:"User role can not verified , please try again later",
        })

   }
}


// Admin
exports.isAdmin = async (req, res , next)=>{
    try{

        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message: 'You are not a Admin',
            });
        }
        next();

    }catch(error){
        res.status(500).json({
            success:false,
            message:"User role can not verified , please try again later",
        })

   }
}
