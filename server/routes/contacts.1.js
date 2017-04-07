// contacts.js
// Benzir Ahmed
// Portfolio Site
// Assignment 2 Authentication - Contact Routes
// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

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

// GET the Contact Details page in order to edit an existing Contact
router.get('/:id', requireAuth, (req, res, next) => {
  try {
    // get a reference to the id from the url
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    // find one contact by its id
    contact.findById(id, (err, contacts) => {
      if (err) {
        console.log(err);
        res.end(error);
      } else {
        // show the contact details view
        res.render('contacts/details', {
          title: 'Contact Details',
          contacts: contacts,
          displayName: req.user.displayName
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }
});

//Adding  competitors
function add_competitor(name) {
    if (name !== "" && name !== undefined) {
        var $competitors = $("#competitors");
        var competitor_list_item = '<li class="list-group-item low-padding-vert" draggable="true"><span class="competitor-seed">' + ($competitors.children().length + 1) + '</span><span class="competitor-name">' + name + '</span><button type="button" class="close" aria-label="Remove"><span class="glyphicon text-danger glyphicon-remove" aria-hidden="true"></span></button></li>'
        $competitors.append(competitor_list_item);
    }
}

$(document).ready(function () {
    'use strict';
    $("body").on("dblclick", ".matchup-member.competitor", function () {
        advance_competitor($(this));
    }).on("mousedown", ".matchup-member.competitor", function (e) {
        e.preventDefault();
    }).on("click", "#build_bracket", function () {
        var tourney_type = $("[name=tourney_type]:checked").val(),
            tourney_seeds = $("[name=tourney_seeds]:checked").val(),
            competitors = [],
            $competitor = $('<div><button type="button" class="btn btn-default btn-sm flex" style="padding:0;padding-right:4px;width:100%;text-align:left;"><span class="fit-width no-padding-vert" style="margin: -1px"><img width="30px" height="30px" style="border-radius: 4px 0 0 4px" src="/static/svg/profile_inv.png" alt="competitor"/></span><span class="competitor-name no-padding-vert width-100 text-left text-sm" style="margin-left: 5px"></span></button></div>');
        $("#competitors").children().each( function () {
            var $competitor_clone = $competitor.clone();
            $competitor_clone.find(".competitor-name").html($(this).children(".competitor-name").text());
            competitors.push($competitor_clone.html());
        });
        build_bracket(tourney_type, tourney_seeds, competitors);
    }).on("change", "[name=view_options]", function () {
        if ($(this).is(":checked")) {
            $("." + $(this).val()).show();
        } else {
            $("." + $(this).val()).hide();
        }
    }).on("click", ".matchup-member.competitor>.advance-competitor", function () {
        advance_competitor($(this).parent(".matchup-member.competitor"));
    }).on("click", ".ui-slider-handle button", function (e) {
        var slider_range = $("#slider-range"),
            values = slider_range.slider("values"),
            bound = parseInt($(this).data("bound")),
            increment = parseInt($(this).data("increment")),
            new_value = values[bound] + increment,
            difference = values[bound] - values[Math.abs(bound - 1)];
        if (difference === 0) {
            values[Math.max(increment, 0)] = new_value;
            slider_range.slider("values", values);
        } else if (Math.max(difference * bound, difference * (bound - 1)) > 0) {
            values[bound] = new_value;
            slider_range.slider("values", values);
        }
    }).on("click", ".close", function() {
        $(this).closest("li").remove();
        $("#competitors").children().each(function(i) {
            $(this).children(".competitor-seed").html(i + 1);
        });
    });
    $("#add_competitor").click( function(e) {
        e.preventDefault(); // Ensure it is only this code that runs
        add_competitor($("#competitor_name").val());
    });
    $("#competitor_name").keypress(function(e) {
        if(e.keyCode === 13){
            e.preventDefault(); // Ensure it is only this code that runs
            add_competitor($(this).val());
        }
    });
});



module.exports = router;