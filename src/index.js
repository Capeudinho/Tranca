const express = require ("express");
const cors = require ("cors");
const mongoose = require ("mongoose");
const routes = require ("./routes");
const {initiateSchedules} = require ("./schedule");
const {initiateMonitors} = require ("./monitor");

const app = express ();

mongoose.connect
(
    "<connectionString>",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.use (cors ());
app.use (express.json ());
app.use (routes);

app.listen (3333);

module.exports = app;

const io = require ("./websocket");
const client = require ("./mqtt");

initiateMonitors ([]);
initiateSchedules ([]);
