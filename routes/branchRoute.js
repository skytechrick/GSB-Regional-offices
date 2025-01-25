import express from 'express';
const branchRoute = express.Router();
export default branchRoute;

import { verifyOfficer } from "../utils/verifyOfficer.js"
import { createBranch , getAllBranches , createBranchManager , getAllBranchManagers } from '../controllers/branchControllers.js';


const apiMiddleware = async (req, res, next) => {
    req.isApi = true;
    next();
};


branchRoute.post("/create", apiMiddleware , verifyOfficer , createBranch );
branchRoute.post("/", apiMiddleware , verifyOfficer , getAllBranches );
branchRoute.post("/manager/create", apiMiddleware , verifyOfficer , createBranchManager );
branchRoute.post("/manager", apiMiddleware , verifyOfficer , getAllBranchManagers );
