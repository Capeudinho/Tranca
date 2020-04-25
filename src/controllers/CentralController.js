const Central = require ("../models/Central");

module.exports =
{
    async list (request, response)
    {
       const centrals = await Central.find ();
       return response.json (centrals);
    },

    async index (request, response)
    {
        const {name} = request.query;
        const central = await Central.find ({name});
        return response.json (central);
    },

    async store (request, response)
    {
        const {name} = request.body;

        const central = await Central.findOne ({name});
        if (central === null)
        {
            var newCentral = await Central.create ({name});
        }

        return response.json (newCentral);
    },

    async destroy (request, response)
    {
        const {name} = request.query;
        const central = await Central.deleteMany (Central.find ({name}));
        return response.json (central);
    }
};