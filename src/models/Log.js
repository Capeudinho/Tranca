const mongoose = require ("mongoose");
const mongoosePaginate = require ("mongoose-paginate");

const LogSchema = new mongoose.Schema
(
    {
        roles: [String],
        user: String,
        lock: String,
        holders: [String],
        type: String,
        creationDate: Date,
        owner: String
    }
);

LogSchema.plugin (mongoosePaginate);
module.exports = mongoose.model ("Log", LogSchema);