const mongoose = require ("mongoose");
const mongoosePaginate = require ("mongoose-paginate");

const RoleSchema = new mongoose.Schema
(
    {
        name: String,
        times:
        [
            {
                start: Number,
                end: Number,
                day: [Boolean],
                options:
                {
                    track: Boolean,
                    direct: Boolean
                }
            }
        ],
        owner: String
    }
);

RoleSchema.plugin (mongoosePaginate);
module.exports = mongoose.model ("Role", RoleSchema);