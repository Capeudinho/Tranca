const Lock = require ("../models/Lock");

module.exports =
{
    async list (request, response)
    {
       const locks = await Lock.find ();
       return response.json (locks);
    },
    
    async index (request, response)
    {
       const lock = await Lock.find ();
       return response.json (lock);
    },

    async store (request, response)
    {
        const {name} = request.body;

        const lock = await Lock.findOne ({name});
        if (lock === null)
        {
            var newLock = await Lock.create ({name});
        }

        return response.json (newLock);
    },

    async destroy (request, response)
    {
        const {name} = request.query;
        const lock = await Lock.deleteMany (Lock.find ({name}));
        return response.json (lock);
    }
};