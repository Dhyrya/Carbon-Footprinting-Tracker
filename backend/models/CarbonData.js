const mongoose = require('mongoose');

const carbonDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['transportation', 'electricity', 'food', 'other']
    },
    emissions: {
        type: Number,
        required: true,
        min: 0
    },
    details: {
        description: String,
        // Add other detail fields as needed
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CarbonData', carbonDataSchema); 