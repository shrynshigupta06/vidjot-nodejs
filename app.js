const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise  = global.Promise;
//connect to mongoose, to check whether the connection is susccessful
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useNewUrlParser: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

//Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

/*
//how middle ware works
app.use(function (req, res, next){
	//console.log(Date.now());
	req.name = "shreeyanshi";
	//this will access throughout the program and will reflect in the console
	next();
});
*/

//BodyParser middlewares. It allows to access names provided in the body sections as request
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
//index route

app.get('/', (req, res) => {
	/*
	//will be used in password authentication
	console.log(req.name);
	//res.send(req.name);
	*/

	const title = 'Welcome';
	res.render('index', {
		title: title
	});
});

app.get('/about', (req, res) => {
	res.render('about');
});

//Add idea form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

//Process Form
app.post('/ideas', (req, res) => {
	/*console.log(req.body);
	res.send('ok');
	*/

	let errors = [];
	if(!req.body.title){
		errors.push({text: 'please add a title'});
	}
	if(!req.body.details){
		errors.push({text: 'please add some details'});
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
			details: req.body.details
		}
		new Idea(newUser)
			.save()
			.then(idea => {
				res.redirect('/ideas');
			})
	}
});

const port = 3000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});