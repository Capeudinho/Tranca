const schedule = require ("node-schedule");
const {checkMonitors} = require ("./monitor");
const Role = require ("./models/Role");
const Log = require ("./models/Log");

var schedules = [];

var rule = new schedule.RecurrenceRule ();
rule.hour = 0;
schedule.scheduleJob
(
    {rule},
    async () =>
    {
        const currentDate = new Date ();
        const logs = await Log.find ();
        logs.map
        (
            async (log) =>
            {
                var difference = currentDate.getTime ()-log.creationDate.getTime ();
                difference = difference/(1000*3600*24);
                if (difference > 30)
                {
                    await Log.findByIdAndDelete (log._id);
                }
            }
        );
    }
)

async function initiateSchedules (roles) // working
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
                (time) =>
                {
                    if (schedules.length === 0)
                    {
                        var {day, hour, minute} = separate (time.end, time.day);
                        var rule = new schedule.RecurrenceRule ();
                        rule.dayOfWeek = day;
                        rule.hour = hour;
                        rule.minute = minute;
                        schedules.push
                        (
                            {
                                end: time.end,
                                day: time.day,
                                ocurrances: 1,
                                scheduledTime: schedule.scheduleJob
                                (
                                    {rule},
                                    () =>
                                    {
                                        checkMonitors (time.end, time.day);
                                    }
                                ) 
                            }
                        );
                    }
                    else
                    {
                        var k;
                        for (k = 0; k < schedules.length; k++)
                        {
                            if (schedules[k].end === time.end && compare (schedules[k].day, time.day))
                            {
                                schedules[k].ocurrances++;
                                k = schedules.length+1;
                            }
                        }
                        if (k === schedules.length)
                        {
                            var {day, hour, minute} = separate (time.end, time.day);
                            var rule = new schedule.RecurrenceRule ();
                            rule.dayOfWeek = day;
                            rule.hour = hour;
                            rule.minute = minute;
                            schedules.push
                            (
                                {
                                    end: time.end,
                                    day: time.day,
                                    ocurrances: 1,
                                    scheduledTime: schedule.scheduleJob
                                    (
                                        {rule},
                                        () =>
                                        {
                                            checkMonitors (time.end, time.day);
                                        }
                                    ) 
                                }
                            );
                        }
                    }
                }
            )
        }
    );
}

function removeSchedules (role) // Theoreticaly working
{
    role.times.map
    (
        (time) =>
        {
            var k;
            for (k = 0; k < schedules.length; k++)
            {
                if (schedules[k].end === time.end && compare (schedules[k].day, time.day))
                {
                    schedules[k].ocurrances--;
                    if (schedules[k].ocurrances === 0)
                    {
                        schedules.splice (k, 1);
                    }
                    k = schedules.length+1;
                }
            }
        }
    );
}

function separate (minutes, days)
{
    var minute = minutes%60;
    var hour = (minutes-minute)/60;
    day = [];
    days.map
    (
        (singleDay, index)=>
        {
            if (singleDay === true)
            {
                day.push (index);
            }
        }
    );
    return {day, hour, minute};
}

function compare (a, b)
{
    if (a === b) {return true;}
    if (a == null || b == null) {return false;}
    if (a.length !== b.length) {return false;}
    for (var k = 0; k < a.length; k++)
    {
        if (a[k] !== b[k]) {return false};
    }
    return true;
}

module.exports = {initiateSchedules, removeSchedules};