const User = require ("../models/User");
const {updateMonitors} = require ("../monitor");

module.exports =
{
    async list (request, response)
    {
        const {owner} = request.query;
        const users = await User.find ({owner});
        return response.json (users);
    },
    
    async listpag (request, response)
    {
        var {page = 1, name, owner} = request.query;
        if (name === "") {var nameValue = {$exists: true};}
        else {var nameValue = {"$regex": name, "$options": "i"};}
        const users = await User.paginate ({name: nameValue, owner}, {page, limit: 25});
        return response.json (users);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const user = await User.findById (_id);
        return response.json (user);
    },

    async store (request, response)
    {
        const {name = "", email = "", MACs = [], roles = [], owner = ""} = request.body;
        const user = await User.findOne ({name, owner});
        if (user === null)
        {
            var newUser = await User.create ({name, email, MACs, roles, owner});
            updateMonitors (roles);
        }
        return response.json (newUser);
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {name = "", email = "", MACs = [], roles = [], owner = ""} = request.body;
        const user = await User.findOne ({name, owner});
        if (user === null || user._id == _id)
        {
            var newUser = await User.findByIdAndUpdate (_id, {name, email, MACs, roles, owner}, {new: true});
            updateMonitors (roles);
        }
        return response.json (newUser);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const user = await User.findByIdAndDelete (_id);
        updateMonitors (user.roles);
        return response.json (user);
    }
};