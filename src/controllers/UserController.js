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
       const user = await User.find ();
       return response.json (user);
    },

    async store (request, response)
    {
        const {name} = request.body;

        const user = await User.findOne ({name});
        if (user === null)
        {
            var newUser = await User.create ({name});
        }

        return response.json (newUser);
    },

    async destroy (request, response)
    {
        const {name} = request.query;
        const user = await User.deleteMany (User.find ({name}));
        return response.json (user);
    }
};