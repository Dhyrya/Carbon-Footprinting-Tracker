const Emission = require('../models/Emission');

// Check Threshold and Send Notification
exports.checkThreshold = async (req, res) => {
    const { threshold } = req.body;
    try {
        const emissions = await Emission.find();
        const totalEmissions = emissions.reduce((sum, e) => sum + e.energy + e.transportation + e.waste, 0);
        if (totalEmissions > threshold) {
            res.json({ message: 'Threshold exceeded!', totalEmissions });
        } else {
            res.json({ message: 'Threshold not exceeded.', totalEmissions });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};