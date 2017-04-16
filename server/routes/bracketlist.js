// contacts.js
// Benzir Ahmed
// Portfolio Site
// Assignment 2 Authentication - Contact Routes
// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let bracketv2 = require('../models/bracketv2');
let build_bracket = require('../models/build_bracket');



// define the contact model
let contact = require('../models/contacts');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET contact List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all contacts in the contacts collection
  contact.find((err, contacts) => {
    if (err) {
      return console.error(err);
    }
    else {
      //array.sort, convert every thing to toUpperCase, 
      contacts.sort((x,y) => {
        let nameX = x.Name.toUpperCase();
        let nameY = y.Name.toUpperCase();
        // x is less than y in the alphabet, Andy vs Jon will return -1 
        if(nameX < nameY){
          return -1;
        } 
        // x is greater than y in the alphabet, Ray vs Andy will return +1
        if(nameX > nameY){
          return 1;
        }
        // the two names match 
          return 0;
      });
      res.render('contacts/index', {
        title: 'Contacts',
        contacts: contacts,
        displayName: req.user.displayName
      });
    }
  }); 
});

//  GET the Contact Details page in order to add a new Contact
router.get('/add', requireAuth, (req, res, next) => {
  res.render('contacts/details', {
    title: "Add a Contact",
    contacts: '',
    displayName: req.user.displayName
  });
});

// POST process the Contact Details page and create a new Contact - CREATE
router.post('/add', requireAuth, (req, res, next) => {
  let newcontact = contact({
    "Name": req.body.name,
    "Phone": req.body.phone,
    "Email": req.body.email
  });

  contact.create(newcontact, (err, contacts) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/contacts');
    }
  });
});

module.exports = router;