import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    originalFileName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    aiExplanation: {
        plainSummary: String,
        dosageInstructions: [String],
        cautionFlags: [String],
        suggestedFollowUp: String,
        rawResponse: String,
        explainedAt: Date
    },
    clarifications: [
        {
            text: { type: String, required: true },
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            senderRole: { type: String, required: true }, // 'Patient' or 'Doctor' / 'PA Admin'
            sentAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
