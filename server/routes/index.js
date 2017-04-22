let express = require('express');
let router = express.Router();

let passport = require('passport');
let UserModel = require('../models/users');
let User = UserModel.User;

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log(req.user);
  res.render('content/index', { 
    title: 'Home',
    username: req.user ? req.user.username : '' });
});

module.exports = router;