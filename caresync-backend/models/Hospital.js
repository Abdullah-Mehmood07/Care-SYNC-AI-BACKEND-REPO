import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Hospital name is required'],
            trim: true
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'City'
        },
        status: {
            type: String,
            required: true,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        }
    },
    {
        timestamps: true
    }
);

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
