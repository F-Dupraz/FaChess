require('dotenv').config();

const createServerApp = require('./api/server');

const websockets = require('./api/server/websockets');

const app = createServerApp();

// Running the server on port
app.listen(process.env.PORT, () => {
  try {
    console.log('\n  Server up!');
  } catch (err) {
    console.log(err);
  }
});

websockets(app);
