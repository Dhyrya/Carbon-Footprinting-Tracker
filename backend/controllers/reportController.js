const Report = require('../models/Report');

// Generate Report
exports.generateReport = async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        const reports = await Report.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};