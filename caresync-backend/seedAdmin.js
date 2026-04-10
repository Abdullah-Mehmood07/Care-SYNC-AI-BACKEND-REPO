import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createMasterAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const adminEmail = 'superadmin@caresync.com';
        
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Master Admin already exists in the database. Exiting...');
            process.exit(0);
        }

        const user = await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: 'superadmin123', // Hardcoded initial password
            role: 'Web Admin'
        });

        console.log('✅ Success! Master Web Admin created.');
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Password: superadmin123 (Please log in and change this later if building a profile page)`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating master admin:', error);
        process.exit(1);
    }
};

createMasterAdmin();
