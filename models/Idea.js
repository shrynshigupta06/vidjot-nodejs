//this is meant to record the schema of the database although it is not very necessary and these files should be named with first letter capitak

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const IdeaSchema = new Schema({
	title:{
		type: String,
		required: true
	},
	details:{
		type: String,
	},
	category:{
		type: String, 
		required: true
	}
	user:{
		type: String,
		required: true
	},
	date:{
		type: Date,
		default: Date.now
	}
});

mongoose.model('ideas', IdeaSchema);