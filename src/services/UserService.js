const User = require ("../models/User");

module.exports =
{
    async list (request, response)
    {
       const users = await User.find ();
       return response.json (users);
    },
    
    async index (request, response)
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

    async destroy (request, response)
    {
        const {_id} = request.query;
        const user = await User.findByIdAndDelete({_id});
        return response.json (user);
    }
};