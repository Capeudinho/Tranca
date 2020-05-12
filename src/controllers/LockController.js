const LockService = require ("../services/LockService");

module.exports =
{
    async list (request, response)
    {
        LockService.list (request, response);
    },

    async idindex (request, response)
    {
        LockService.idindex (request, response);
    },

    async store (request, response)
    {
        LockService.store (request, response);
    },

    async idupdate (request, response)
    {
        LockService.idupdate (request, response);
    },

    async idupdatesimp (request, response)
    {
        LockService.idupdatesimp (request, response);
    },

    async iddestroy (request, response)
    {
        LockService.iddestroy (request, response);
    }
};