const mongoose = require('mongoose')

// Run command: sudo run-rs -v 4.0.0 to start an replicaSet  server and primary server else transactions wont work on standalone server

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
})

const conn = mongoose.connection;
conn.on('error', () => console.error.bind(console, 'connection error'));
conn.once('open', () => console.info('Connection to Database is successful'));

module.exports = conn;
