const mongoose = require ("mongoose");

const ScheduleSchema = new mongoose.Schema
(
    {
        group: String,
        users: [String],
        start: Number,
        end: Number,
        day: Number

    }
);

module.exports = mongoose.model ("Role", RoleSchema);