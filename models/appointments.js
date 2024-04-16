const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
