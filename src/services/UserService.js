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
        const {nome} = request.query;
        const user = await User.findOne ({nome});
        return response.json (user);
    },

    async store (request, response)
    {
        const {name, MACs} = request.body;

        const user = await User.findOne ({name});
        if (user === null)
        {
            var newUser = await User.create ({name, MACs});
        }

        return response.json (newUser);
    },

    async destroy (request, response)
    {
        const {nome} = request.query;
        const user = await User.findOneAndDelete({nome});
        return response.json (user);
    }
};