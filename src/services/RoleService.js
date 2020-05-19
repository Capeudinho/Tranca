const Role = require ("../models/Role");
const User = require ("../models/User");
const Group = require ("../models/Group");

module.exports =
{
    async list (request, response)
    {
        const roles = await Role.find ();
        return response.json (roles);
    },

    async listpag (request, response)
    {
        const {page = 1} = request.query;
        const roles = await Role.paginate ({}, {page, limit: 10});
        return response.json (roles);
    },

    async namelistpag (request, response)
    {
        const {name, page = 1} = request.query;
        const roles = await Role.paginate ({name: {"$regex": name, "$options": "i"}}, {page, limit: 10});
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
        const {name = "", times = []} = request.body;
        const role = await Role.create ({name, times});
        return response.json (role);
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {name = "", times = []} = request.body;
        const role = await Role.findByIdAndUpdate (_id, {name, times}, {new: true});
        return response.json (role);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const role = await Role.findByIdAndDelete (_id);
        await User.updateMany ({roles: {$in: [_id]}}, {$pullAll: {roles: [_id]}});
        await Group.updateMany ({roles: {$in: [_id]}}, {$pullAll: {roles: [_id]}});
        return response.json (role);
    }
};