const mongoose = require('mongoose')

// Run command: sudo run-rs -v 4.0.0 to start an replicaSet  server and primary server else transactions wont work on standalone server

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

const client = mongoose.connection;

client.on('error', (err) => console.log(err));
client.once('open', () => console.info('Connection to Database is successful'));

module.exports = client;
