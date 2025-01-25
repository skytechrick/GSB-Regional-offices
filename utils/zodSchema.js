import z from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});


export const createBranchSchema = z.object({
    id: z.string().min(4).max(255),
    branchName: z.string().min(4).max(255),
    branchEmail: z.string().email(),
    address: z.object({
        address: z.string().min(4).max(255),
        pinCode: z.string().max(6).min(6),
        city: z.string().min(4).max(255),
        state: z.string().min(4).max(255),
        country: z.string().min(4).max(255),
    }),
});


export const createBranchManagerSchema = z.object({
    id: z.string().min(24).max(24),
    name: z.string().min(3).max(255),
    age: z.string().min(2).max(2).optional(),
    email: z.string().email(),
    mobileNumber: z.string().min(10).max(10),
    role: z.string().min(4).max(255).optional(),
    address: z.object({
        address: z.string().min(4).max(255),
        pinCode: z.string().max(6).min(6),
        city: z.string().min(4).max(255),
        state: z.string().min(4).max(255),
        country: z.string().min(4).max(255),
    }),

});