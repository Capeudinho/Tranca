const mongoose = require ("mongoose");

const LockSchema = new mongoose.Schema
(
    {
        name: String,
        holder: [String]
    }
);

module.exports = mongoose.model ("Lock", LockSchema);