const mongoose = require ("mongoose");

const GroupSchema = new mongoose.Schema
(
    {
        name: String,
        holder: String
    }
);

module.exports = mongoose.model ("Group", GroupSchema);