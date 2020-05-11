const Group = require ("../models/Group");

module.exports =
{
    async list (request, response)
    {
        const groups = await Group.find ();
        return response.json (groups);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const group = await Group.findById (_id);
        return response.json (group);
    },

    async levelindex (request, response)
    {
        const {level} = request.query;
        const groups = await Group.find ({level});
        return response.json (groups);
    },

    async contentindex (request, response)
    {
        const {content} = request.query;
        const groups = await Group.find ({_id: {$in: content}});
        return response.json (groups);
    },

    async store (request, response)
    {
        const {name = "", _id = ""} = request.body;
        const holderGroup = await Group.findById (_id);
        var newHolder = holderGroup.holder;
        newHolder.push (holderGroup._id);
        const group = await Group.findOne ({name});
        if (group === null)
        {
            var newGroup = await Group.create
            (
                {
                    name,
                    holder: newHolder,
                    level: 1,
                    content: []
                }
            );
        }
        var newContent = holderGroup.content;
        newContent.push (newGroup._id);
        const newContentGroup = await Group.findByIdAndUpdate
        (
            _id,
            {
                content: newContent
            },
            {
                new: true
            }
        );
        return response.json ({newGroup, newContentGroup});
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {name = "", holder = "", level = 0, content = []} = request.body;
        const group = await Group.findByIdAndUpdate (_id, {name, holder, level, content}, {new: true});
        return response.json (group);
    },

    async idupdatesimp (request, response)
    {
        const {_id} = request.query;
        const {name = ""} = request.body;
        const group = await Group.findByIdAndUpdate (_id, {name}, {new: true});
        return response.json (group);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const group = await Group.findByIdAndDelete (_id);
        const otherGroups = await Group.find ({holder: {$in: [_id]}});
        await Group.updateMany ({$pullAll: {content: [_id]}});
        await Group.deleteMany ({holder: {$in: [_id]}});
        return response.json ({group, otherGroups});
    }
};