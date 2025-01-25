import express from 'express';
const auth = express.Router();
export default auth;

import { login , loginVerifyOtp } from '../controllers/authController.js';


const apiMiddleware = async (req, res, next) => {
    req.isApi = true;
    next();
};

auth.post('/login' , apiMiddleware , login);
auth.post('/login-verify-otp' , apiMiddleware , loginVerifyOtp );