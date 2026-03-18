import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the service name']
    },
    description: {
        type: String
    },
    price: {
        type: Number // Optional for later
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'A service must be assigned to a hospital']
    }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
