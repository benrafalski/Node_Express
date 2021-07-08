// all modules being imported for the app use the require function
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { body, validationResult } = require('express-validator');
const mongojs = require('mongojs'); 

var app = express();
var db = mongojs('customerApp', ['users']);

/*
// logger must go before the route handler
var logger = function(req, res, next){
    console.log('logging...');
    next();
}

app.use(logger);
*/

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middleware
app.use(bodyParser.json()); // parses json content
app.use(bodyParser.urlencoded({extented: false}));

// set static path, for CSS/HTML files etc
app.use(express.static(path.join(__dirname, 'public')));

// global vars
app.use((req, res, next) => {
    res.locals.errors = null;
    next();
})

// get request for the home page, this is the route handler
app.get('/', (req, res) => {
    db.users.find((err, docs) => {
        
        res.render('index', {
            title: 'Customers',
            users: docs
        });
    })
    
});

app.post(
    '/users/add',
    // fields are not allowed to be empty 
    body('firstName', 'First Name is required').notEmpty(),
    body('lastName', 'Last Name is required').notEmpty(),
    body('email', 'email is required').notEmpty(),
    (req, res) => {
    

    errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('index', {
          title: 'Customers',
          users: users,
          errors: errors.array()
      })  
      //console.log({errors: errors.array()});
      //return res.status(400).json({ errors: errors.array() });
      console.log('there were errors');
      return;
    }

    var newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }
    db.users.insert(newUser, (err, result) => {
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
    
    console.log('success!');
})

app.delete('/users/delete/:id', (req, res) => {
    db.users.remove({_id: mongojs.ObjectId(req.params.id)}, (err, result) => {
        if(err){
            console.log(err);
        }
        res.redirect('/');
    })
})

app.put('/users/update/:id', (req, res) => {
    console.log(req.body.firstName);
    db.users.update(
        {_id: mongojs.ObjectID(req.params.id)}, 
        {$set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }}, (err, result) => {
        if(err){
            console.log(err);
        }
        res.redirect('/');
    })
})

// establishes server on port 3000
app.listen(3000, () => {
    console.log('server started on port 3000...');
});