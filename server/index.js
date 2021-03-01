// require dotenv package to read the properties in the .env file.
// never upload .env file to git.
require('dotenv').config();
//import the express module
const express = require('express');
// import the path utils from Node.
const path = require('path');
const cors = require('cors');
const cookSession = require('cookie-session');

// Importing our Login Service Used With the POST Login Route
const loginService = require('./services/loginService');
const signupService = require('./services/signupService');

// create an instance of express
const app = express();

// read the value of PORT NODE_EVN variable in the .env file
// when the index.js file starts up this file is read in and
// we can set configuration variables for the application.
// never upload to git...
const PORT = process.env.PORT || 5000;

// Middleware For Cross Origin Resource SHaring
app.use(cors());

//To get access to the name value pairs send in the message Body of POST Request.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(
  cookSession({
    name: 'session',
    keys: ['SDFLU9iw2308dlsfuwe2adfl', 'LDFA34gsdfgFOPW2323DA7FS2'],
  })
);

// Setup Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

//Middleware Serving Static Pages from client directory
// second parameter is an configuration object of how we want
// the static file server to run.

app.use(express.static(path.join(__dirname, '../client'), { extensions: ['html', 'htm'] }));

// Routing Middleware.
// login route.
// Access Form Data uses the POST method from the req body.
// Tell Express that you want to access POST Request body
// Setup   app.use(express.urlencoded({extended:true}))

// Basic Example of a Protected Route
app.get('/dashboard', (req, res) => {
  if (req.session.isValid) {
    res.render('dashboard');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  // user template placed inside the views directory
  // res.render(view, data)   ejs.render(template, {data})
  res.render('login', { passwordWarning: '', emailWarning: '', email: '', password: '' });
});

app.get('/signup', (req, res) => {
  // user template placed inside the views directory
  // res.render(view, data)   ejs.render(template, {data})
  res.render('signup', { usernameWarning: '', passwordWarning: '', emailWarning: '', email: '', password: '' });
});

app.post('/login', (req, res) => {
  // if your incomming name value pairs are alot then create an object
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };
  // isValidUser returns {user:null, emailWarning, passwordWarning}
  // isValudUser.user !=null...
  const isValidUser = loginService.authenticate(credentials);

  //if the isValidUser has a user returned
  if (isValidUser.user !== null) {
    // set a session value isValid
    if (!req.session.isValid) {
      req.session.isValid = true;
    }
    res.redirect('dashboard');
  }

  if (isValidUser.user === null) {
    // req.body.email, req.body.password
    res.render('login', {
      emailWarning: isValidUser.emailWarning,
      passwordWarning: isValidUser.passwordWarning,
      email: req.body.email,
      password: req.body.password,
    });
  }
});

app.post('/signup', (req, res) => {
  const credentials = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  const isValidUser = signupService.authenticate(credentials);

  //if the isValidUser has a user returned
  if (isValidUser.isValid) {
    // set a session value isValid
    if (!req.session.isValid) {
      req.session.isValid = true;
    }
    // user redirected to login
    res.redirect('login');
  }

  // if the registration is invalid, present the user with error messages and keep them on registration page
  if (!isValidUser.user) {
    // req.body.email, req.body.password
    res.render('signup', {
      usernameWarning: isValidUser.usernameWarning,
      emailWarning: isValidUser.emailWarning,
      passwordWarning: isValidUser.passwordWarning,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
  }
});

app.post('/login', (req, res) => {
  // POST name value pairs in body request
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };

  const isValidUser = loginService.authenticate(credentials);

  res.end();
});

// Final Middleware
// Catch all for any request not handled while express was
// processing requests.
// Returns 404 Page from the client directory.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../client/404.html'));
});

// Tell express app to listen for incomming request on a specific PORT
app.listen(PORT, () => {
  console.log(`server started on http://localhost:5000`);
});
