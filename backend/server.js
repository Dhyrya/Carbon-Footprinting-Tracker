const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Enhanced Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Check if environment variables are loaded
console.log('MongoDB URI:', process.env.MONGODB_URI); // This will help debug

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Models
const User = require('./models/User');
const Report = require('./models/Report');
const Notification = require('./models/Notification');
const CarbonData = require('./models/CarbonData');

// Auth Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-default-secret',
            { expiresIn: '24h' }
        );

        // Send response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log('Login request received:', req.body);
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-default-secret',
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Profile Routes
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

app.put('/api/profile/update', authMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findById(req.user.id);

        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Reports Routes
app.get('/api/reports', authMiddleware, async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

app.post('/api/reports/generate', authMiddleware, async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const newReport = new Report({
            userId: req.user.id,
            startDate,
            endDate,
            totalEmissions: 0 // You'll need to calculate this based on your data
        });
        await newReport.save();
        res.json(newReport);
    } catch (err) {
        res.status(500).json({ message: 'Error generating report' });
    }
});

// Notifications Routes
app.get('/api/notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

app.put('/api/notifications/:id', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: 'Error updating notification' });
    }
});

// Dashboard Route
app.get('/api/dashboard', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get total emissions
        const totalEmissions = await CarbonData.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$emissions" } } }
        ]);

        // Get recent activities
        const recentActivities = await CarbonData.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        res.json({
            totalEmissions: totalEmissions[0]?.total || 0,
            recentActivities: recentActivities || []
        });
    } catch (err) {
        console.error('Dashboard data error:', err);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Data Input Route
app.post('/api/data/add', authMiddleware, async (req, res) => {
    try {
        console.log('Received data:', req.body);
        console.log('User:', req.user);

        const { type, emissions, details } = req.body;

        // Validate input
        if (!type || emissions === undefined) {
            return res.status(400).json({ message: 'Type and emissions are required' });
        }

        const newData = new CarbonData({
            userId: req.user._id, // Note: changed from req.user.id to req.user._id
            type,
            emissions: Number(emissions),
            details,
            date: new Date()
        });

        console.log('Saving data:', newData);
        await newData.save();
        
        res.status(201).json({
            message: 'Data added successfully',
            data: newData
        });
    } catch (err) {
        console.error('Error adding data:', err);
        res.status(500).json({ message: 'Error adding carbon data' });
    }
});

// Get User's Data
app.get('/api/data', authMiddleware, async (req, res) => {
    try {
        const data = await CarbonData.find({ userId: req.user._id })
            .sort({ date: -1 });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// Delete Data Entry
app.delete('/api/data/:id', authMiddleware, async (req, res) => {
    try {
        const data = await CarbonData.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ message: 'Error deleting carbon data' });
    }
});

// Update Data Entry
app.put('/api/data/:id', authMiddleware, async (req, res) => {
    try {
        const { type, emissions, details } = req.body;
        
        const data = await CarbonData.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                type,
                emissions,
                details,
                date: new Date()
            },
            { new: true }
        );
        
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        
        res.json(data);
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ message: 'Error updating carbon data' });
    }
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('API Routes:');
    console.log('POST /api/auth/signup - Create new account');
    console.log('POST /api/auth/login - Login to existing account');
    console.log('GET /test - Test API connection');
});
