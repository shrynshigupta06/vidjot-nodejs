module.exports = {
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash('error_msg', 'not authorised');
		res.redirect('/users/login');
	}
}