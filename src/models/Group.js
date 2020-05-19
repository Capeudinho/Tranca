const mongoose = require ("mongoose");

const GroupSchema = new mongoose.Schema
(
    {
        name: String,
        holder: [String],
        content: [String],
        roles: [String]
    }
);

module.exports = mongoose.model ("Group", GroupSchema);