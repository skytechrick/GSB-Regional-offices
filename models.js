import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const user = mongoose.connection;

mongoose.connect(URL);

user.on("error", console.error.bind(console, "connection error:"));

user.once("open", () => {
    console.log("Connected to Users MongoDB");
});

const newSchema = mongoose.Schema;
const newModel = mongoose.model;

const userSchema = newSchema({
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    personalInfo:{
        firstName: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        lastName: {
            type: String,
            max: 255,
            min: 3,
            default: null,
        },
        mobileNumber: {
            type: Number,
            default: null
        },
        age: {
            type: Number,
            min: 13,
            max: 120,
            default: null,
        },
        gender: {
            type: String,
            default: null,
        },
    },
    password: {
        required: false,
        type: String,
        min: 8,
    },
    isBan: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    loggedIn:{
        token: {
            type: String,
            default: null,
        },
        lastLoggedIn: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
    },
    authentication: {
        otp: {
            type: Number,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
    },
    cart:[],
    buyNow:[],
    orders:[],
    addresses:[],
    searchHistory:[],
    lastViewedProducts:[],
    interestedProducts:[],
    favouriteProducts:[],
    notifications:[],
    gsbCoins:[],
    wishlist:[],
    overview:[],
    bankAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userBankAccount",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    }
});
const userBankAccountSchema = newSchema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    bankName: {
        type: String,
        default: "",
    },
    benificiaryName: {
        type: String,
        default: "",
    },
    accountNumber: {
        type: Number,
        default: 0,
    },
    ifscCode: {
        type: String,
        default: "",
    }
});

const adminSchema = newSchema({
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    personalInfo:{
        firstName: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        lastName: {
            type: String,
            max: 255,
            min: 3,
            default: null,
        },
        mobileNumber: {
            type: Number,
            default: null
        },
        age: {
            type: Number,
            min: 13,
            max: 120,
            default: null,
        },
    },
    password: {
        required: false,
        type: String,
        min: 8,
    },
    isBan: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    loggedIn:{
        token: {
            type: String,
            default: null,
        },
        lastLoggedIn: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
    },
    authentication: {
        otp: {
            type: Number,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const headOfficeSchema = newSchema({
    headOfficeName: {
        type: String,
        required: true,
        max: 255,
        min: 4,
    },
    officers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "head_office_officers",
    }],
    officialEmail: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    country: {
        type: String,
        required: true,
        max: 255,
        min: 4,
    },
    regionalOffices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "regional_office",
    }],
    headOfficeHistory: [{
        _id: false,
        historyType: {
            type: String,
        },
        relation: {
            type: mongoose.Schema.Types.ObjectId,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    }],
    address: {
        address: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        state: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        country: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },

});

const headOfficeOfficersSchema = newSchema({
    role: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        default: "officer",
    },
    name: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },
    age: {
        type: Number,
        min: 13,
        max: 120,
        default: null,
    },
    mobileNumber: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    password: {
        required: false,
        type: String,
    },
    headOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "head_office",
    },
    loggedIn:{
        token: {
            type: String,
            default: null,
        },
        lastLoggedIn: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
    },

    authentication: {
        otp: {
            type: Number,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },

    
});

const regionalOfficeSchema = newSchema({
    regionalOfficeName: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        unique: true,
    },
    officers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "regional_office_officers",
    }],
    officialEmail: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    headOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "head_office",
    },
    branches:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
    }],
    state: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },

    address: {
        address: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        state: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        country: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
    },
    regionalOfficeHistory: [{
        _id: false,
        historyType: {
            type: String,
        },
        relation: {
            type: mongoose.Schema.Types.ObjectId,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});



const regionalOfficeOfficersSchema = newSchema({
    role: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        default: "officer",
    },
    name: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },
    age: {
        type: Number,
        min: 13,
        max: 120,
        default: null,
    },
    mobileNumber: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    password: {
        required: false,
        type: String,
    },
    regionalOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "regional_office",
    },
    loggedIn:{
        token: {
            type: String,
            default: null,
        },
        lastLoggedIn: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
    },

    authentication: {
        otp: {
            type: Number,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const branchSchema = newSchema({
    branchName: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        unique: true,
    },
    managers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch_manager",
    }],
    branchEmail: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    regionalOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "regional_office",
    },

    address: {
        address: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        state: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        country: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
    },
    branchHistory: [{
        _id: false,
        historyType: {
            type: String,
        },
        relation: {
            type: mongoose.Schema.Types.ObjectId,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const branchManagerSchema = newSchema({
    role: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        default: "manager",
    },
    name: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },
    age: {
        type: Number,
        min: 13,
        max: 120,
        default: null,
    },
    mobileNumber: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    password: {
        required: false,
        type: String,
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
    },
    loggedIn:{
        token: {
            type: String,
            default: null,
        },
        lastLoggedIn: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
    },

    authentication: {
        otp: {
            type: Number,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});


export default {
    user: newModel("user", userSchema),
    userBankAccount: newModel("userBankAccount", userBankAccountSchema),
    admins: newModel("admins", adminSchema),
    headOffice: newModel("head_office", headOfficeSchema),
    headOfficeOfficers: newModel("head_office_officers", headOfficeOfficersSchema),
    regionalOffice: newModel("regional_office", regionalOfficeSchema),
    regionalOfficeOfficers: newModel("regional_office_officers", regionalOfficeOfficersSchema),
    branch: newModel("branch", branchSchema),
    branchManager: newModel("branch_Manager", branchManagerSchema),
};