require('dotenv').config();

const createServerApp = require('./server');

const app = createServerApp();

// Running the server on port
app.listen(process.env.SERVER_PORT, () => {
  try {
    console.log('\n  Server up!');
  } catch (err) {
    console.log(err);
  }
});

// Making sure the server is up
app.on('listening', () => {
  console.log(`\n  Server running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
});
