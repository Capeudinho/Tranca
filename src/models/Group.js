const mongoose = require ("mongoose");

const GroupSchema = new mongoose.Schema
(
    {
        name: String,
        level: Number,
        holder: [String],
        content: [String]
    }
);

module.exports = mongoose.model ("Group", GroupSchema);