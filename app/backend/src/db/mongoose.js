const mongoose = require('mongoose')

// Run command: sudo run-rs -v 4.0.0 to start an replicaSet  server and primary server else transactions wont work on standalone server

mongoose.connect('mongodb+srv://abhay-jindal:eICSoS5AqDO2yoLk@wallet-cluster.e7vxjnb.mongodb.net/wallet?maxPoolSize=50')

const client = mongoose.connection;

client.on('error', (err) => console.log(err));
client.once('open', () => console.info('Connection to Database is successful'));

module.exports = client;
