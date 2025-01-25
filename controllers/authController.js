
import Modules from '../models.js';
import { sendMail } from "../utils/sendMail.js";
import { loginSchema } from "../utils/zodSchema.js"
import crypto from 'crypto';
import { hashPassword, comparePassword } from "../utils/passwordController.js";
import { generateToken , verifyToken } from "../utils/jwtController.js";

export const login = async ( req , res , next ) => {
    try {

        const isValid = loginSchema.safeParse(req.body);
        if(!isValid.success){
            return res.status(400).json({message: "Unauthorized access."});
        };
        
        const token = crypto.randomBytes(32).toString("hex");
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiry = Date.now() + 300000;
        const email = isValid.data.email.toLowerCase();
        

        const regionalOfficeOfficers = await Modules.regionalOfficeOfficers.findOne({email})
        if(!regionalOfficeOfficers){
            return res.status(404).json({message: "Officer not found"});
        };
        if(regionalOfficeOfficers.isBan){
            return res.status(401).json({message: "Officer is banned"});
        };

        const isPasswordMatch = await comparePassword(req.body.password, regionalOfficeOfficers.password);

        if(!isPasswordMatch){
            regionalOfficeOfficers.loggedIn.loginAttempts++;
            regionalOfficeOfficers.save();
            return res.status(401).json({message: "Invalid password"});
        };

        regionalOfficeOfficers.loggedIn.loginAttempts = 0;
        regionalOfficeOfficers.authentication.otp = otp;
        regionalOfficeOfficers.authentication.otpExpiry = otpExpiry;
        regionalOfficeOfficers.authentication.token = token;
        await regionalOfficeOfficers.save();

        const isMailSent = await sendMail({
            from: `No-reply <${process.env.MAIL_ID}>`,
            to: email,
            subject: "Regional officer Logged in",
            html: `<h1>Regional officer login OTP: ${otp}</h1>${Date().toLocaleString()}`,
        });

        if(!isMailSent){
            return res.status(500).json({message: "Unable to send OTP."});
        };

        const jwtToken = generateToken({
            id: regionalOfficeOfficers._id,
            token,
            createdAt: Date.now(),
        })

        return res.status(201).cookie("regionalOfficerOtp",jwtToken,{
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 5,
            signed: true,
        }).json({message: "OTP sent to your email."});

    } catch (error) {
        next(error);
    };
};

export const loginVerifyOtp = async ( req , res , next ) => {
    try {
        const regionalOfficerOtp = req.signedCookies.regionalOfficerOtp;
        if(!regionalOfficerOtp){
            return res.status(401).json({message: "Unauthorized access."});
        };
        
        const decoded = verifyToken(regionalOfficerOtp);
        
        if(!decoded){
            return res.status(401).json({message: "Unauthorized access."});
        };
        
        const regionalOfficeOfficers = await Modules.regionalOfficeOfficers.findById(decoded.id);
        
        if(!regionalOfficeOfficers){
            return res.status(404).json({message: "Officer not found"});
        };
        
        if(regionalOfficeOfficers.authentication.token !== decoded.token){
            return res.status(401).json({message: "Unauthorized access."});
        };
        
        if(regionalOfficeOfficers.authentication.otpExpiry < Date.now()){
            return res.status(401).json({message: "OTP expired."});
        };
        
        const otp = req.body.otp;
        if(!otp){
            return res.status(400).json({message: "OTP is required."});
        };
        if(otp.length !== 6){
            return res.status(400).json({message: "Invalid OTP."});
        };

        if(parseInt(otp,10) !== regionalOfficeOfficers.authentication.otp){
            return res.status(401).json({message: "Invalid OTP."});
        };

        const token = crypto.randomBytes(32).toString("hex");
        

        const jwtToken = generateToken({
            id: regionalOfficeOfficers._id,
            token,
            createdAt: Date.now(),
        });

        
        regionalOfficeOfficers.loggedIn.lastLoggedIn = Date.now();
        regionalOfficeOfficers.loggedIn.token = token;
        regionalOfficeOfficers.authentication.otp = null;
        regionalOfficeOfficers.authentication.otpExpiry = null;
        regionalOfficeOfficers.authentication.token = null;
        await regionalOfficeOfficers.save();

        const isMailSent = await sendMail({
            from: `No-reply <${process.env.MAIL_ID}>`,
            to: regionalOfficeOfficers.email,
            subject: "Regional Officer Logged in",
            html: `<h1>Regional logged in at ${Date().toLocaleString()}</h1>`,
        });

        if(!isMailSent){
            return res.status(500).json({message: "Unable to send mail."});
        };

        return res.status(200).clearCookie("regionalOfficerOtp").cookie("regionalOfficer",jwtToken,{
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
            signed: true,
        }).json({message: "Logged in."});
        
    } catch (error) {
        next(error);
    };
};