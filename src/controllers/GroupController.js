const GroupService = require ("../services/GroupService");

module.exports =
{
    async list (request, response)
    {
        GroupService.list (request, response);
    },

    async idindex (request, response)
    {
        GroupService.idindex (request, response);
    },

    async levelindex (request, response)
    {
        GroupService.levelindex (request, response);
    },

    async contentindex (request, response)
    {
        GroupService.contentindex (request, response);
    },

    async store (request, response)
    {
        GroupService.store (request, response);
    },

    async idupdate (request, response)
    {
        GroupService.idupdate (request, response);
    },

    async idupdatesimp (request, response)
    {
        GroupService.idupdatesimp (request, response);
    },

    async iddestroy (request, response)
    {
        GroupService.iddestroy (request, response);
    }
};