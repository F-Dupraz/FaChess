require('dotenv').config();

const createServerApp = require('./api/server');

const websockets = require('./api/server/websockets');

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
  console.log(`  Server running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
});

websockets(app);
