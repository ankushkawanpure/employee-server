const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');

// const config = require('./config/config');

// Use Node's default promise instead of Mongoose's promise library
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://admin:admin1234@ds251819.mlab.com:51819/employeedb');

let db = mongoose.connection;

db.on('open', () => {
    console.log('Connected to the database.');
});

db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

const app = express();

app.enable('trust proxy');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

// Initialize routes middleware
app.use('/api/employees', require('./routes/employees'));

// Use express's default error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(400).json({ err: err });
});

// Start the server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Set up socket.io
const io = socket(server);
let online = 0;

io.on('connection', (socket) => {
    online++;
    console.log(`Socket ${socket.id} connected.`);
    console.log(`Online: ${online}`);
    io.emit('visitor enters', online);

    socket.on('add', data => socket.broadcast.emit('add', data));
    socket.on('update', data => socket.broadcast.emit('update', data));
    socket.on('delete', data => socket.broadcast.emit('delete', data));

    socket.on('disconnect', () => {
        online--;
        console.log(`Socket ${socket.id} disconnected.`);
        console.log(`Online: ${online}`);
        io.emit('visitor exits', online);
    });
});
