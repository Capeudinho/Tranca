const UserService = require ("../services/UserService");

module.exports =
{
    async list (request, response)
    {
        UserService.list (request, response);
    },

    async index (request, response)
    {
        UserService.index (request, response);
    },

    async store (request, response)
    {
        UserService.store (request, response);
    },

    async destroy (request, response)
    {
        UserService.destroy (request, response);
    }
};