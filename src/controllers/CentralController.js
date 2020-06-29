const Central = require ("../models/Central");
const User = require ("../models/User");
const Group = require ("../models/Group");
const Lock = require ("../models/Lock");
const Role = require ("../models/Role");

module.exports =
{
    async list (request, response)
    {
        const centrals = await Central.find ();
        return response.json (centrals);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const central = await Central.findById (_id);
        return response.json (central);
    },

    async loginindex (request, response)
    {
        const {email, password} = request.query;
        const central = await Central.findOne ({email, password});
        return response.json (central);
    },

    async store (request, response)
    {
        const {name = "", email = "", password = ""} = request.body;
        const central = await Central.findOne ({email});
        if (central === null)
        {
            var newCentral = await Central.create ({name, email, password});
        }
        return response.json (newCentral);
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {name = "", email = "", password = ""} = request.body;
        const central = await Central.findByIdAndUpdate (_id, {name, email, password}, {new: true});
        return response.json (central);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const central = await Central.findByIdAndDelete (_id);
        await User.deleteMany ({owner: _id});
        await Group.deleteMany ({owner: _id});
        await Lock.deleteMany ({owner: _id});
        await Role.deleteMany ({owner: _id});
        return response.json (central);
    }
};