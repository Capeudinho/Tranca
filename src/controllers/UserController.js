const UserService = require ("../services/UserService");

module.exports =
{
    async list (request, response)
    {
        UserService.list (request, response);
    },

    async listpag (request, response)
    {
        UserService.listpag (request, response);
    },

    async namelistpag (request, response)
    {
        UserService.namelistpag (request, response);
    },

    async idindex (request, response)
    {
        UserService.idindex (request, response);
    },

    async store (request, response)
    {
        UserService.store (request, response);
    },

    async iddestroy (request, response)
    {
        UserService.iddestroy (request, response);
    }
};