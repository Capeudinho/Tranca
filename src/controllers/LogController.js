const Log = require ("../models/Log");

module.exports =
{
    async list (request, response)
    {
        const {owner} = request.query;
        const logs = await Log.find ({owner});
        return response.json (logs);
    },

    async listpag (request, response)
    {
        var {page = 1, user, lock, role, type, initialDate, finalDate, owner} = request.query;
        if (user === "") {var userValue = {$exists: true};}
        else {var userValue = {"$regex": user, "$options": "i"};}
        if (lock === "") {var lockValue = {$exists: true};}
        else {var lockValue = {"$regex": lock, "$options": "i"};}
        if (role === "") {var roleValue = {$exists: true};}
        else {var roleValue = role;}
        if (type === "") {var typeValue = {$exists: true};}
        else {var typeValue = type;}
        if (initialDate === "") {var initialDateValue = {$exists: true};}
        else {var initialDateValue = {"$gte": new Date (initialDate)};}
        if (finalDate === "") {var finalDateValue = {$exists: true};}
        else {var finalDateValue = {"$lte": new Date (finalDate)};}
        const dateValue = Object.assign (initialDateValue, finalDateValue);
        const logs = await Log.paginate
        (
            {
                user: userValue,
                lock: lockValue,
                roles: roleValue,
                type: typeValue,
                creationDate: dateValue,
                owner
            },
            {
                page,
                limit: 25
            }
        );
        return response.json (logs);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const log = await Log.findById (_id);
        return response.json (log);
    },

    async store (request, response)
    {
        const {roles = [], user = "", lock = "", holders = [], type = "", owner = ""} = request.body;
        var creationDate = new Date ();
        var offset = creationDate.getTimezoneOffset ();
        var minutes = creationDate.getMinutes ();
        creationDate.setMinutes (minutes-offset);
        var newLog = await Log.create ({roles, user, lock, holders, type, creationDate, owner});
        return response.json (newLog);
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {roles = [], user = "", lock = "", holders = [], type = "", owner = ""} = request.body;
        const log = await Log.findByIdAndUpdate (_id, {roles, user, lock, holders, type, owner}, {new: true});
        return response.json (log);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const log = await Log.findByIdAndDelete (_id);
        return response.json (log);
    }
};