import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Patient ID is required']
    },
    visitDate: {
        type: Date,
        required: [true, 'Visit date is required']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        default: null
    },
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required'],
        trim: true
    },
    treatment: {
        type: String,
        trim: true
    },
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    notes: {
        type: String,
        trim: true
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    followUpDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
medicalHistorySchema.index({ patientId: 1, visitDate: -1 });
medicalHistorySchema.index({ patientId: 1 });
medicalHistorySchema.index({ doctorId: 1 });

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);
export default MedicalHistory;
