const cors = require("cors");
const express = require('express');
const app = express();
const helmet = require("helmet");

const corsOptions = {
  origin: "https://g-4.org",
  credentials: true
}

require("dotenv").config();

const {
    getG4team,
    getEvents,
    postEmail,
    postTeam,
    postEvent,
    deleteTeam,
    updateTeam,
    postSignIn,
    helloWorld
} = require("./handlers");

app.use(helmet())
app.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS, HEAD, GET, PUT, POST, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
  });
app.use(express.static('./server/assets'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/'));
app.use(cors(corsOptions));
app.get('/api/helloworld', helloWorld);
app.get('/api/get_events', getEvents);
app.get('/api/getg4team', getG4team);
app.post('/api/auth/signin', postSignIn);
app.post('/api/add_team', postTeam);
app.post('/api/add_event', postEvent);
app.post('/api/send_email', postEmail);
app.patch('/api/update_team/:teamId', updateTeam)
app.delete('/api/delete_team/:teamId', deleteTeam);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})