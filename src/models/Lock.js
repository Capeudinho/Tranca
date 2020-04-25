const mongoose = require ("mongoose");

const LockSchema = new mongoose.Schema
(
    {
        name: String,
        access: Number
    }
);

module.exports = mongoose.model ("Lock", LockSchema);