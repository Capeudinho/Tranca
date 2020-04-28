const mongoose = require ("mongoose");

const RoleSchema = new mongoose.Schema
(
    {
        name: String,
        users: [String],
        schedules: [String]
    }
);

module.exports = mongoose.model ("Role", RoleSchema);