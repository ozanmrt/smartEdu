const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

//DB CONNECT
mongoose
  .connect('mongodb://localhost/smartedu-db')
  .then(() => {
    console.log('DB Connected Successfully');
  })
  .catch((err) => {
    console.log(err);
  });

//Template Engine
app.set('view engine', 'ejs');

//Global Variables
global.userIN=null;

//Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/smartedu-db' })
  })
);
app.use(flash());
app.use((req, res, next) => {
  // flash mesajlari local degiskene atandi
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);


//ROUTERS
app.use('*', (req, res, next) => {
  userIN=req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
