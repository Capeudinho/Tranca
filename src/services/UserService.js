const User = require ("../models/User");

module.exports =
{
    async list (request, response)
    {
        const users = await User.find ();
        return response.json (users);
    },
    
    async listpag (request, response)
    {
        const {page = 1} = request.query;
        const users = await User.paginate ({}, {page, limit: 10});
        return response.json (users);
    },

    async namelistpag (request, response)
    {
        const {name, page = 1} = request.query;
        const users = await User.paginate ({name: {"$regex": name, "$options": "i"}}, {page, limit: 10});
        return response.json (users);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const user = await User.findById ({_id});
        return response.json (user);
    },

    async store (request, response)
    {
        const {name, email, MACs} = request.body;
        const user = await User.findOne ({name});
        if (user === null)
        {
            var newUser = await User.create ({name, email, MACs});
        }
        return response.json (newUser);
    },

    async update (request, response)
    {
        //complete later
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const user = await User.findByIdAndDelete({_id});
        return response.json (user);
    }
};