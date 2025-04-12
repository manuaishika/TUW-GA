const Booking = require('../models/Booking');
const User = require('../models/User');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { facility, date, startTime, endTime, purpose } = req.body;

        // Check for overlapping bookings
        const existingBooking = await Booking.findOne({
            facility,
            date,
            $or: [
                {
                    $and: [
                        { startTime: { $lte: startTime } },
                        { endTime: { $gt: startTime } }
                    ]
                },
                {
                    $and: [
                        { startTime: { $lt: endTime } },
                        { endTime: { $gte: endTime } }
                    ]
                }
            ],
            status: { $ne: 'rejected' }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Time slot already booked' });
        }

        const booking = new Booking({
            facility,
            date,
            startTime,
            endTime,
            purpose,
            requester: req.user.userId
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        let query = {};

        // Students can only see their own bookings
        if (user.role === 'student') {
            query.requester = req.user.userId;
        }
        // Faculty can see their department's bookings
        else if (user.role === 'faculty') {
            const students = await User.find({ department: user.department });
            const studentIds = students.map(s => s._id);
            query.requester = { $in: studentIds };
        }

        const bookings = await Booking.find(query)
            .populate('requester', 'name email department')
            .populate('facultyApproval.approvedBy', 'name')
            .populate('adminApproval.approvedBy', 'name')
            .sort({ date: 1, startTime: 1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get booking by ID
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('requester', 'name email department')
            .populate('facultyApproval.approvedBy', 'name')
            .populate('adminApproval.approvedBy', 'name');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Faculty approval
exports.facultyApprove = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const user = await User.findById(req.user.userId);
        if (user.role !== 'faculty') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.facultyApproval = {
            status: 'approved',
            approvedBy: req.user.userId,
            approvedAt: new Date()
        };

        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin approval
exports.adminApprove = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const user = await User.findById(req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.adminApproval = {
            status: 'approved',
            approvedBy: req.user.userId,
            approvedAt: new Date()
        };
        booking.status = 'approved';

        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const user = await User.findById(req.user.userId);
        if (!['faculty', 'admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (user.role === 'faculty') {
            booking.facultyApproval = {
                status: 'rejected',
                approvedBy: req.user.userId,
                approvedAt: new Date()
            };
        } else {
            booking.adminApproval = {
                status: 'rejected',
                approvedBy: req.user.userId,
                approvedAt: new Date()
            };
        }
        booking.status = 'rejected';

        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}; 