const mongoose = require ("mongoose");

const CentralSchema = new mongoose.Schema
(
    {
        name: String,
        email: String,
        password: String
    }
);

module.exports = mongoose.model ("Central", CentralSchema);