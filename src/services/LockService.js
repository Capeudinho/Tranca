const Lock = require ("../models/Lock");
const Group = require ("../models/Group");

module.exports =
{
    async list (request, response)
    {
        const lock = await Lock.find ();
        return response.json (lock);
    },
    
    async idindex (request, response)
    {
        const {_id} = request.query;
        const lock = await Lock.findById (_id);
        return response.json (lock);
    },

    async store (request, response)
    {
        const {name = "", _id = ""} = request.body;
        const holderGroup = await Group.findById (_id);
        var newHolder = holderGroup.holder;
        newHolder.push (holderGroup._id);
        const lock = await Lock.findOne ({name});
        if (lock === null)
        {
            var newLock = await Lock.create
            (
                {
                    name,
                    holder: newHolder
                }
            );
            var newContent = holderGroup.content;
            newContent.push (newLock._id);
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
        return response.json ({newLock, newContentGroup});
    },

    async idupdate (request, response)
    {
        const {_id} = request.query;
        const {name = "", holder = ""} = request.body;
        const lock = await Lock.findByIdAndUpdate (_id, {name, holder}, {new: true});
        return response.json (lock);
    },

    async idupdatesimp (request, response)
    {
        const {_id} = request.query;
        const {name = ""} = request.body;
        const lock = await Lock.findByIdAndUpdate (_id, {name}, {new: true});
        return response.json (lock);
    },

    async iddestroy (request, response)
    {
        const {_id} = request.query;
        const lock = await Lock.findByIdAndDelete (_id);
        var newContentGroup = await Group.findOneAndUpdate ({content: {$in: [_id]}}, {$pullAll: {content: [_id]}}, {new: true});
        return response.json ({lock, newContentGroup});
    }
};