const mongoose = require ("mongoose");

const UserSchema = new mongoose.Schema
(
    {
        name: String,
        email: String,
        MACs: [String]
    }
);

module.exports = mongoose.model ("User", UserSchema);