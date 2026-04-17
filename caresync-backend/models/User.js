import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            required: true,
            enum: ['Web Admin', 'Hospital Admin', 'Patient', 'Lab Admin', 'PA Admin'],
            default: 'Patient'
        },
        // For Patient Role: Unique Identifier
        ghid: {
            type: String,
            unique: true,
            sparse: true // Only enforced if the field exists (i.e., for patients)
        },
        national_id: {
            type: String,
            unique: true,
            sparse: true
        },
        // For Patient Role: Mapping to specific hospital internal MR numbers
        localMrNumbers: [{
            hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
            mrNumber: { type: String }
        }],
        // For Hospital Admin Role: Which hospital do they manage?
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital'
        },
        // For PA Admin Role: Which doctor do they assist?
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor'
        }
    },
    {
        timestamps: true
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving to DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
