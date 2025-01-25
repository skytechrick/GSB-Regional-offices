import Modules from "../models.js";
import { verifyToken } from "./jwtController.js";


export const verifyOfficer = async ( req , res , next ) => {
    try {
        const token = req.signedCookies.headOfficeOfficer;
        
        if(!token){
            return res.status(401).json({message: "Unauthorized access."});
        };

        const decoded = verifyToken(token);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized access."});
        };

        const officer = await Modules.headOfficeOfficers.findById(decoded.id).populate("headOffice").exec();

        if(!officer){
            return res.status(404).json({message: "officer not found"});
        };

        if(officer.loggedIn.token !== decoded.token){
            return res.status(401).json({message: "Unauthorized access."});
        };
        if(officer.isBan){
            return res.status(401).json({message: "Unauthorized access."});
        };

        // if(!officer.isVerified){
        //     return res.status(401).json({message: "Unauthorized access."});
        // };

        req.officer = officer;
        next();
        
    } catch ( error ) {
        next(error);
    };
};