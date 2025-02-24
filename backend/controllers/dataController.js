
const Emission = require('../models/Emission');

exports.addEmissionData = async (req, res) => {
    const { energy, transportation, waste } = req.body;
    try {
        const emission = new Emission({ energy, transportation, waste });
        await emission.save();
        res.status(201).json({ message: 'Emission data added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEmissionData = async (req, res) => {
    try {
        const emissions = await Emission.find();
        res.json(emissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
