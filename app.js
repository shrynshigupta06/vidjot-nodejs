const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Db config
const db = require('./config/database');

//Map global promise - get rid of warning
mongoose.Promise  = global.Promise;

//'mongodb://localhost:27017/vidjot-dev'
//connect to mongoose, to check whether the connection is susccessful
mongoose.connect(db.mongoURI, {
	useNewUrlParser: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


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


//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method override middleware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//apssport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

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


//use routes
app.use('/ideas', ideas);
app.use('/users', users);

//to deploy it on heroku
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});