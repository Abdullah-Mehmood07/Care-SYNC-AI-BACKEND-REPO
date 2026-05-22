import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    testType: {
        type: String,
        trim: true
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
    aiSummary: {
        plainSummary: String,
        keyFindings: [String],
        cautionFlags: [String],
        suggestedFollowUp: String,
        rawResponse: String,
        summarizedAt: Date
    }
}, {
    timestamps: true
});

const LabReport = mongoose.model('LabReport', labReportSchema);
export default LabReport;

