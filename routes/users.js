const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load user model
require('../models/User');
const User = mongoose.model('users');

//User Login Route
router.get('/login', (req, res) => {
	res.render('users/login');
});

//User Register Route
router.get('/register', (req, res) => {
	res.render('users/register'); 
});

//login form post
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);

});

//register form POST
router.post('/register', (req, res) => {
	/*console.log(req.body);
	res.send('register');
	*/
	let errors = [];

	if(req.body.password != req.body.password2){
		errors.push({text: 'Passwords do not match'});
	}
	if(req.body.password.length < 4){
		errors.push({text: 'Password must be at least 4 characters'});
	}
 	if(errors.length > 0){
		res.render('users/register', {
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2
		});
	}
	else{
		//to check whether same email doesnt get register once again
		User.findOne({email: req.body.email})
		.then(user => {
			if(user){
				req.flash('error_msg', 'Email already registered');
				res.redirect('/users/register');
			}
			else{
				//to hash the password
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				});
			
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) throw err;
						newUser.password = hash;
						newUser.save()
						.then(user => {
							req.flash('success_msg', 'You are now registered and can login now');
							res.redirect('/users/login');
						})
						.catch(err => {
							console.log('/users/login');
							return;
						});
					});
				});
			//res.send('passed!');
			}
		});
	}
});

//logout user
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'you are logged out');
	res.redirect('/users/login');
})
module.exports = router;