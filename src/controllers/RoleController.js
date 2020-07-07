const Role = require ("../models/Role");
const User = require ("../models/User");
const Group = require ("../models/Group");
const {initiateSchedules, removeSchedules} = require ("../schedule");
const {updateMonitors} = require ("../monitor");

module.exports =
{
    async list (request, response)
    {
        const {owner} = request.query;
        const roles = await Role.find ({owner});
        return response.json (roles);
    },

    async listpag (request, response)
    {
        var {page = 1, name, owner} = request.query;
        if (name === "") {var nameValue = {$exists: true};}
        else {var nameValue = {"$regex": name, "$options": "i"};}
        const roles = await Role.paginate ({name: nameValue, owner}, {page, limit: 25});
        return response.json (roles);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const role = await Role.findById (_id);
        return response.json (role);
    },

    async store (request, response)
    {
        const {name = "", times = [], owner = ""} = request.body;
        console.log (times);
        const role = await Role.findOne ({name, owner});
        if (role === null)
        {
            var newRole = await Role.create ({name, times, owner});
            initiateSchedules ([newRole]);
            updateMonitors ([newRole]);
        }
        return response.json (newRole);
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {name = "", times = [], owner = ""} = request.body;
        const role = await Role.findOne ({name, owner});
        if (role === null || role._id == _id)
        {
            const oldRole = await Role.findById (_id);
            var newRole = await Role.findByIdAndUpdate (_id, {name, times, owner}, {new: true});
            removeSchedules (oldRole);
            initiateSchedules ([newRole]);
            updateMonitors ([newRole]);
        }
        return response.json (newRole);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const role = await Role.findByIdAndDelete (_id);
        await User.updateMany ({roles: {$in: [_id]}}, {$pullAll: {roles: [_id]}});
        await Group.updateMany ({roles: {$in: [_id]}}, {$pullAll: {roles: [_id]}});
        removeSchedules (role);
        updateMonitors ([role]);
        return response.json (role);
    }
};