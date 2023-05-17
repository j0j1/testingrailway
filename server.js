const cors = require("cors");
const express = require('express');
const app = express();
const helmet = require("helmet");

const corsOptions = {
  origin: "http://g-4.org",
  credentials: true
}

require("dotenv").config();

const {
  getG4team,
  getEvents,
  getDepartment,
  getDepartments,
  getArticles,
  getArticle,
  postEmail,
  postTeam,
  postEvent,
  postArticle,
  deleteTeam,
  deleteEvent,
  updateEvent,
  updateTeam,
  updateDepartment,
  postSignIn
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
app.get('https://testingrailway-production-d638.up.railway.app/api/get_events', getEvents)
app.get('https://testingrailway-production-d638.up.railway.app/api/getg4team', getG4team);
app.get('https://testingrailway-production-d638.up.railway.app/api/get_department/:department', getDepartment);
app.get('https://testingrailway-production-d638.up.railway.app/api/get_departments', getDepartments);
app.get('https://testingrailway-production-d638.up.railway.app/api/get_articles', getArticles);
app.get('https://testingrailway-production-d638.up.railway.app/api/get_article/:articleID', getArticle);
app.post('https://testingrailway-production-d638.up.railway.app/api/auth/signin', postSignIn);
app.post('https://testingrailway-production-d638.up.railway.app/api/add_team', postTeam);
app.post('https://testingrailway-production-d638.up.railway.app/api/add_event', postEvent);
app.post('https://testingrailway-production-d638.up.railway.app/api/send_email', postEmail);
app.post('https://testingrailway-production-d638.up.railway.app/api/add_article', postArticle)
app.patch('https://testingrailway-production-d638.up.railway.app/api/update_team/:teamId', updateTeam);
app.patch('https://testingrailway-production-d638.up.railway.app/api/update_event/:eventId', updateEvent);
app.patch('https://testingrailway-production-d638.up.railway.app/api/update_department/:department', updateDepartment);
app.delete('https://testingrailway-production-d638.up.railway.app/api/delete_team/:teamId', deleteTeam);
app.delete('https://testingrailway-production-d638.up.railway.app/api/delete_event/:eventId', deleteEvent);


const port = process.env.PORT;
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})