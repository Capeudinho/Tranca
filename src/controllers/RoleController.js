const RoleService = require ("../services/RoleService");

module.exports =
{
    async list (request, response)
    {
        RoleService.list (request, response);
    },

    async listpag (request, response)
    {
        RoleService.listpag (request, response);
    },

    async namelistpag (request, response)
    {
        RoleService.namelistpag (request, response);
    },

    async idindex (request, response)
    {
        RoleService.idindex (request, response);
    },

    async store (request, response)
    {
        RoleService.store (request, response);
    },

    async idupdate (request, response)
    {
        RoleService.idupdate (request, response);
    },

    async iddestroy (request, response)
    {
        RoleService.iddestroy (request, response);
    }
};