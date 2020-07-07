const mongoose = require ("mongoose");

const LockSchema = new mongoose.Schema
(
    {
        name: String,
        holder: [String],
        owner: String
    }
);

module.exports = mongoose.model ("Lock", LockSchema);