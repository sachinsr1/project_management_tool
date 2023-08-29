var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
//const mySQL = require('mysql');
const base = require('./base.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var createAccountRouter = require("./routes/create_account.js");
var signInRouter = require("./routes/sign_in.js");
var createProfileRouter = require('./routes/create_profile.js');
var createProjectRouter = require('./routes/create_project.js');
var viewProjectsRouter = require('./routes/view_projects.js');
var getTasksRouter = require('./routes/display_tasks.js');
const bodyParser = require('body-parser');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
//insertion
app.use("/create_account", createAccountRouter);
app.use('/sign_in', signInRouter);
app.use('/create_profile', createProfileRouter);
app.use('/create_project', createProjectRouter);
app.use('/view_projects', viewProjectsRouter);
app.use('/edit_project', getTasksRouter);
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
