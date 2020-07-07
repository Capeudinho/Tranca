const Group = require ("../models/Group");
const Lock = require ("../models/Lock");
const {updateMonitors} = require ("../monitor");

module.exports =
{
    async list (request, response)
    {
        const {owner} = request.query;
        const groups = await Group.find ({owner});
        return response.json (groups);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const group = await Group.findById (_id);
        const lock = await Lock.findById (_id);
        if (group === null && lock !== null)
        {return response.json (lock);}
        else
        {return response.json (group);}
    },

    async levelindex (request, response)
    {
        const {level, owner} = request.query;
        const groups = await Group.find ({holder: {$size: level}, owner});
        return response.json (groups);
    },

    async contentindex (request, response)
    {
        const {content} = request.query;
        const groups = await Group.find ({_id: {$in: content}});
        const locks = await Lock.find ({_id: {$in: content}});
        groups.push (...locks);
        return response.json (groups);
    },

    async store (request, response)
    {
        const {name = "", roles = [], _id = "", owner = ""} = request.body;
        if (_id !== "")
        {
            const holderGroup = await Group.findById (_id);
            var newHolder = holderGroup.holder;
            newHolder.push (holderGroup._id);
            const group = await Group.findOne ({name, owner});
            if (group === null)
            {
                var newGroup = await Group.create
                (
                    {
                        name,
                        holder: newHolder,
                        content: [],
                        roles,
                        owner
                    }
                );
                updateMonitors (roles);
                var newContent = holderGroup.content;
                newContent.push (newGroup._id);
                var newContentGroup = await Group.findByIdAndUpdate
                (
                    _id,
                    {
                        content: newContent
                    },
                    {
                        new: true
                    }
                );
            }
            return response.json ({newGroup, newContentGroup});
        }
        else
        {
            var group = await Group.create ({name, roles, owner});
            updateMonitors (roles);
            return response.json (group);
        }
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {name = "", holder = "", content = [], roles = [], owner = ""} = request.body;
        const group = await Group.findByIdAndUpdate (_id, {name, holder, content, roles, owner}, {new: true});
        updateMonitors (roles);
        return response.json (group);
    },

    async idupdatesimp (request, response)
    {
        const {_id} = request.query;
        const {name = "", roles = [], owner = ""} = request.body;
        const group = await Group.findOne ({name, owner});
        if (group === null || group._id == _id)
        {
            var newGroup = await Group.findByIdAndUpdate (_id, {name, roles}, {new: true});
            updateMonitors (roles);
        }
        return response.json (newGroup);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const group = await Group.findByIdAndDelete (_id);
        const otherGroups = await Group.find ({holder: {$in: [_id]}});
        const otherLocks = await Lock.find ({holder: {$in: [_id]}});
        var newContentGroup = await Group.findOneAndUpdate ({content: {$in: [_id]}}, {$pullAll: {content: [_id]}}, {new: true});
        await Group.deleteMany ({holder: {$in: [_id]}});
        await Lock.deleteMany ({holder: {$in: [_id]}});
        updateMonitors (group.roles);
        return response.json ({group, otherGroups, otherLocks, newContentGroup});
    }
};