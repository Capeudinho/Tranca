const mongoose = require ("mongoose");

const CentralSchema = new mongoose.Schema
(
    {
        name: String
    }
);

module.exports = mongoose.model ("Central", CentralSchema);