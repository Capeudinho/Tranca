const mongoose = require ("mongoose");

const UserSchema = new mongoose.Schema
(
    {
        name: String,
        job: String,
        access: Number,
        schedule:
        [
            {
                day: Number,
                hour: Number,
                minute: Number
            }
        ]
    }
);

module.exports = mongoose.model ("User", UserSchema);