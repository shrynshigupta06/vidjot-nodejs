//to club all idea routes into one file

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
//curly brace is used for destructuring
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//idea index page
router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({user: req.user.id})
	.sort({date:'desc'})
	.then(ideas => {
		res.render('ideas/index', {
			ideas:ideas
		});
	});
});

//Add idea form
//we want to protect this route so add ensureAuthenticated
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('ideas/add');
});

//Edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		if(idea.user != req.user.id){
			req.flash('error_msg', 'you are not Auhorised');
			res.redirect('/ideas');
		}
		else{
			res.render('ideas/edit', {
				idea: idea
			});
		}
	});
});

//Process Form
router.post('/', ensureAuthenticated, (req, res) => {

	let errors = [];
	if(!req.body.title){
		errors.push({text: 'please add a title'});
	}
	if(!req.body.details){
		errors.push({text: 'please add some details...details are empty'});
	}

	if(errors.length > 0){
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	}
	else{
		//res.send('passed');
		const newUser = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		}
		new Idea(newUser)
			.save()
			.then(idea => {
				req.flash('success_msg', 'Video Idea added successfully!');
				res.redirect('/ideas');
			})
	}
});

//edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		//new values
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
		.then(idea => {
			req.flash('success_msg', 'Video Idea updated successfully!');
			res.redirect('/ideas');
		})
	})
});

//Delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
	//res.send('delete');
	Idea.remove({_id: req.params.id})
	.then(() => {
		req.flash('success_msg', 'Video Idea removed done'); 
		res.redirect('/ideas');
	});
});


module.exports = router;