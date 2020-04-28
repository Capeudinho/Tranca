const mongoose = require ("mongoose");

const UserSchema = new mongoose.Schema
(
    {
        name: String,
        MACs: [String]
    }
);

module.exports = mongoose.model ("User", UserSchema);