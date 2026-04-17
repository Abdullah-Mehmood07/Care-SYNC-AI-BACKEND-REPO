import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the doctor\'s name']
    },
    specialty: {
        type: String,
        required: [true, 'Please provide the doctor\'s specialty']
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'A doctor must be assigned to a hospital']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave'],
        default: 'Active'
    },
    dutyStatus: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'In Consultation'],
        default: 'Off Duty'
    },
    weeklySchedule: {
        type: Map,
        of: Boolean,
        default: {
            Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false
        }
    }
}, {
    timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
