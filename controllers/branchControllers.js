
import Models from '../models.js';

import { createBranchSchema , createBranchManagerSchema } from '../utils/zodSchema.js';

import { hashPassword } from '../utils/passwordController.js';

export const createBranch = async ( req , res , next ) => {
    try {
        const officer = req.officer;

        const isValid = createBranchSchema.safeParse(req.body);

        if(!isValid.success){
            return res.status(400).json({message: "Invalid data"});
        };

        const searchFound = await Models.regionalOffice.findById(isValid.data.id);
        if(!searchFound){
            return res.status(400).json({message: "Regional office not found"});
        };

        const newBranchObj = {
            branchName: isValid.data.branchName,
            branchEmail: isValid.data.branchEmail,
            address: isValid.data.address,
            regionalOffice: searchFound._id,
        };

        const searchFirst = await Models.branch.findOne({branchEmail: newBranchObj.branchEmail});
        if(searchFirst){
            return res.status(400).json({message: "Branch already exists"});
        };

        const searchSecond = await Models.branch.findOne({branchName: newBranchObj.branchName});

        if(searchSecond){
            return res.status(400).json({message: "Branch already exists"});
        };

        const newBranch = await Models.branch(newBranchObj);
        const newResponse = await newBranch.save();

        const branch = await Models.regionalOffice.findByIdAndUpdate(searchFound._id, {
            $push: {branches: newResponse._id}
        });

        return res.status(201).json({message: "Branch created", regionalOffice: newResponse});

    } catch (error) {
        next(error);
    };
};

export const getAllBranches = async ( req , res , next ) => {
    try {

        const officer = req.officer;

        const branch = await Models.branch.find({
            regionalOffice: officer.regionalOffice._id
        });

        if(branch.length < 1){
            return res.status(404).json({message: "No regional offices found"});
        };

        const response = {
            message: "All branches",
            totalBranches: branch.length,
            branch,
        };
        return res.status(200).json(response);

    } catch (error) {
        next(error);
    };
};

export const createBranchManager = async ( req , res , next ) => {
    try {
        const officer = req.officer;

        const isValid = createBranchManagerSchema.safeParse(req.body);

        if(!isValid){
            return res.status(400).json({message: "Invalid request."});
        };

        const branch = await Models.branch.findById(isValid.data.id);

        if(!branch){
            return res.status(404).json({message: "Regional Office not found."});
        };
        
        let email = isValid.data.email.toLowerCase();


        const searchFirst = await Models.branchManager.findOne({email: email});

        if(searchFirst){
            return res.status(400).json({message: "Manager already exists."});
        };

        const hashedPassword = await hashPassword(`GSB-${email}`);
        const newManager = {
            name: isValid.data.name,
            email: email,
            age: isValid.data.age,
            mobileNumber: isValid.data.mobileNumber,
            role: isValid.data.role,
            password: hashedPassword,
            address: {
                address: isValid.data.address.address,
                pinCode: isValid.data.address.pinCode,
                city: isValid.data.address.city,
                state: isValid.data.address.state,
                country: isValid.data.address.country,
            },
            branch: branch._id,
        };

        const newManagerN = await Models.branchManager(newManager);

        const createdManagerResponse = await newManagerN.save();

        const aaaaaa = await Models.branch.findByIdAndUpdate(branch._id, {
            $push: {managers: createdManagerResponse._id},
        });

        const response = {
            message: "Branch manager created successfully.",
            officer: createdManagerResponse,
        };

        return res.status(201).json(response);

    } catch (error) {
        next(error);
    };
};

export const getAllBranchManagers = async ( req , res , next ) => {
    try {
        const officer = req.officer;

        const regionalOfficeOfficers = await Models.branchManager.find({});

        if(regionalOfficeOfficers.length < 1){
            return res.status(404).json({message: "No officers found."});
        };

        const response = {
            message: "All officers",
            totalOfficers: regionalOfficeOfficers.length,
            regionalOfficeOfficers,
            role: regionalOfficeOfficers.map(officer => officer.role),
        };

        return res.status(200).json(response);

    } catch (error) {
        next(error);
    };
};