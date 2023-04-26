const mongoose = require('mongoose');
require('dotenv').config();

async function startDB() {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to ', db.connection.name);
  } catch (error) {
    console.error(error);
  }
}

startDB();

mongoose.connection.on('connected', () => {
  console.log('\n  Mongoose is connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('  Mongoose is disconnected');
});
