const mqtt = require ("mqtt");
const io = require ("./websocket");
const {accessMonitor} = require ("./monitor");
const Group = require ("./models/Group");
const Lock = require ("./models/Lock");
const Role = require ("./models/Role");
const User = require ("./models/User");
const Log = require ("./models/Log");

const client = mqtt.connect ("mqtt://broker.hivemq.com");

client.on
(
    "connect",
    () =>
    {
        client.subscribe
        (
            "checkAccess",
            (error) =>
            {
                if (error !== true)
                {
                    //client.publish
                    //(
                    //    "checkAccess",
                    //    JSON.stringify
                    //    (
                    //        {
                    //            _id: "5ef2c238597ed2c8da19f9fc",
                    //            MAC: "123"
                    //        }
                    //    )
                    //);

                    //setTimeout 
                    //(
                    //    () =>
                    //    {
                    //        io.emit
                    //        (
                    //            "log",
                    //            {
                    //                user: "UserTwo",
                    //                lock: "LockTwoTwo",
                    //                day: 6,
                    //                time: 120,
                    //                type: "warning",
                    //                owner: "5ec7c93118badec7e95d061c",
                    //            }
                    //        );
                    //        console.log ("Emitiu");
                    //    },
                    //    20000
                    //);
                }
            }
        );
    }
);

client.on
(
    "message",
    async (topic, message) =>
    {
        if (topic === "checkAccess")
        {
            message = JSON.parse (message);
            const _id = message._id;
            const MAC = message.MAC;
            const user = await User.findOne ({MACs: MAC});
            if (user !== null)
            {
                const lock = await Lock.findById (_id);
                const groups = await Group.find ({_id: {$in: lock.holder}});
                var holderNames = [];
                var roleIds = [];
                groups.map
                (
                    (group, index) =>
                    {
                        holderNames[index] = group.name;
                        group.roles.map
                        (
                            (role) =>
                            {
                                if (roleIds.includes (role) === false)
                                {
                                    roleIds.push (role);
                                }
                            }
                        );
                    }
                );
                if (roleIds.length !== 0 && user.roles.some ((value) => roleIds.indexOf (value) >= 0))
                {
                    var currentTime = new Date;
                    currentTime =
                    {
                        hour: (currentTime.getHours ()*60)+currentTime.getMinutes (),
                        day: currentTime.getDay ()
                    };
                    const roles = await Role.find ({_id: {$in: roleIds}});
                    var usedTimes = [];
                    var usedRoles = [];
                    roles.map
                    (
                        (role) =>
                        {
                            role.times.map
                            (
                                (time) =>
                                {
                                    if (currentTime.hour >= time.start && currentTime.hour <= time.end && time.day [currentTime.day] === true)
                                    {
                                        usedTimes.push (time);
                                        usedRoles.push (role.name);
                                    }
                                }
                            )
                        }
                    );
                }
                if (usedTimes.length > 0)
                {
                    console.log ("Permitir");
                    client.publish
                    (
                        "respondAccess",
                        _id+" true"
                    );
                    accessMonitor (usedTimes, user, lock);
                    const log = await Log.create
                    (
                        {
                            roles: usedRoles,
                            user: user.name,
                            lock: lock.name,
                            holders: holderNames,
                            type: "normal",
                            creationDate: getLocalDate (),
                            owner: user.owner
                        }
                    );
                    io.emit ("log", log);
                }
                else
                {
                    console.log ("Bloquear");
                    client.publish
                    (
                        "respondAccess",
                        "false"
                    );
                }
            }
            else
            {
                console.log ("Stop");
                client.publish
                (
                    "respondAccess",
                    "false"
                );
            }
        }
    }
);

function getLocalDate ()
{
    var localDate = new Date ();
    var offset = localDate.getTimezoneOffset ();
    var minutes = localDate.getMinutes ();
    localDate.setMinutes (minutes-offset);
    return localDate;
}

module.exports = client;