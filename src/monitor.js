const io = require ("./websocket");
const Group = require ("./models/Group");
const Lock = require ("./models/Lock");
const Role = require ("./models/Role");
const User = require ("./models/User");
const Log = require ("./models/Log");

var monitors = [];

async function initiateMonitors (roles) // working
{
    if (roles.length === 0)
    {
        roles = await Role.find ();
    }
    roles.map
    (
        (role) =>
        {
            role.times.map
            (
                async (time) =>
                {
                    if (time.options.track === true)
                    {
                        const users = await User.find ({roles: role._id});
                        if (time.options.direct === true)
                        {
                            const groups = await Group.find ({roles: role._id});
                            var groupsIds = [];
                            groups.map
                            (
                                (group) =>
                                {
                                    groupsIds.push (group._id);
                                }
                            );
                            var locks = await Lock.find ({holder: {$in: groupsIds}});
                            locks = locks.filter
                            (
                                (lock) =>
                                {
                                    if (groupsIds.includes (lock.holder[lock.holder.length-1]))
                                    {
                                        return true;
                                    }
                                    return false;
                                }
                            );
                        }
                        else
                        {
                            const groups = await Group.find ({roles: role._id});
                            var groupsIds = [];
                            groups.map
                            (
                                (group) =>
                                {
                                    groupsIds.push (group._id);
                                }
                            );
                            var locks = await Lock.find ({holder: {$in: groupsIds}});
                        }
                        var lockRelations = [];
                        locks.map
                        (
                            (lock) =>
                            {
                                lockRelations.push
                                (
                                    {
                                        lock,
                                        access: false
                                    }
                                );
                            }
                        );
                        var userRelations = [];
                        users.map
                        (
                            (user) =>
                            {
                                userRelations.push
                                (
                                    {
                                        user,
                                        lockRelations
                                    }
                                );
                            }
                        );
                        monitors.push
                        (
                            {
                                roleName: role.name,
                                timeId: time._id,
                                end: time.end,
                                day: time.day,
                                userRelations
                            }
                        );
                    }
                }
            );
        } 
    );
}

async function updateMonitors (roleIds) // working
{
    const roles = await Role.find ({_id: {$in: roleIds}});
    roles.map
    (
        (role) =>
        {
            role.times.map
            (
                (time) =>
                {
                    for (var k = 0; k < monitors.length; k++)
                    {
                        if (String (monitors[k].timeId) === String (time._id))
                        {
                            monitors.splice (k, 1);
                            k = monitors.length;
                        }
                    }
                }
            );
        }
    );
    initiateMonitors (roles);
}

function accessMonitor (times, user, lock) // working
{
    times.map
    (
        (time) =>
        {
            for (var k = 0; k < monitors.length; k++)
            {
                if (String (monitors[k].timeId) === String (time._id))
                {
                    for (var j = 0; j < monitors[k].userRelations.length; j++)
                    {
                        if (String (monitors[k].userRelations[j].user._id) === String (user._id))
                        {
                            for (var i = 0; i < monitors[k].userRelations[j].lockRelations.length; i++)
                            {
                                if (String (monitors[k].userRelations[j].lockRelations[i].lock._id) === String (lock._id))
                                {
                                    monitors[k].userRelations[j].lockRelations[i].access = true;
                                    i = monitors[k].userRelations[j].lockRelations.length;
                                }
                            }
                            j = monitors[k].userRelations.length;
                        }
                    }
                    k = monitors.length;
                }
            }
        }
    );
}

function checkMonitors (end, day) // working
{
    var nonAccessedMonitors = [];
    monitors.map
    (
        (monitor) =>
        {
            var correctDay = false
            for (var k = 0; k < 7; k++)
            {
                if (monitor.day[k] === true && day[k] === true)
                {
                    correctDay = true;
                }
            }
            if (monitor.end === end && correctDay === true)
            {
                monitor.userRelations.map
                (
                    (userRelation) =>
                    {
                        nonAccessedMonitors.push
                        (
                            {
                                roleName: monitor.roleName,
                                user: userRelation.user,
                                locks: []
                            }
                        );
                        userRelation.lockRelations.map
                        (
                            (lockRelation) =>
                            {
                                if (lockRelation.access === false)
                                {
                                    nonAccessedMonitors[nonAccessedMonitors.length-1].locks.push (lockRelation.lock);
                                }
                                else
                                {
                                    lockRelation.access = false;
                                }
                            }
                        );
                        if (nonAccessedMonitors[nonAccessedMonitors.length-1].locks.length === 0)
                        {
                            nonAccessedMonitors.splice (-1, 1);
                        }
                    }
                );
            }
        }
    );
    nonAccessedMonitors.map
    (
        (nonAccessedMonitor) =>
        {
            nonAccessedMonitor.locks.map
            (
                async (lock) =>
                {
                    const groups = await Group.find ({_id: {$in: lock.holder}});
                    var holderNames = [];
                    groups.map
                    (
                        (group, index) =>
                        {
                            holderNames[index] = group.name;
                        }
                    );
                    const log = await Log.create
                    (
                        {
                            roles: [nonAccessedMonitor.roleName],
                            user: nonAccessedMonitor.user.name,
                            lock: lock.name,
                            holder: holderNames,
                            type: "warning",
                            creationDate: getLocalDate (),
                            owner: nonAccessedMonitor.user.owner
                        }
                    );
                    io.emit ("log", log);
                }
            )
        } 
    );
}

function getLocalDate ()
{
    var localDate = new Date ();
    var offset = localDate.getTimezoneOffset ();
    var minutes = localDate.getMinutes ();
    localDate.setMinutes (minutes-offset);
    return localDate;
}

module.exports = {initiateMonitors, updateMonitors, accessMonitor, checkMonitors};