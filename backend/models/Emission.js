
const mongoose = require('mongoose');

const EmissionSchema = new mongoose.Schema({
    energy: { type: Number, required: true },
    transportation: { type: Number, required: true },
    waste: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Emission', EmissionSchema);
