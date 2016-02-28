var local = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");
var db = require("./db");

// expose this function to our app using module.exports
module.exports = function (passport) {

	// bcrypt methods
	hashPw = function(pw) { return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null); };
	validPw = function(pw1, pw2) { return bcrypt.compareSync(pw1, pw2); };

	passport.serializeUser(function (user, done) {
		done(null, user.aid);
	});

	passport.deserializeUser(function (id, done) {
		db("admins").where("aid", id).limit(1)
		.then(function (admin) {
			if (admin.constructor === Array) { admin = admin[0]; }
			done(null, admin);
		})
		.catch(function (err) {
			done(err, null);
		});
	});

	passport.use("local-signup", new local({
			usernameField: "email",
			passwordField: "pass",
			passReqToCallback: true
		},

		function (req, email, password, done) {

			// first make sure that pw and emails match
			var pw_match = (req.body.pass == req.body.pass2);
			var em_match = (req.body.email == req.body.email2);
			var name_ok = (req.body.name && req.body.name !== "" && req.body.name.length > 0)

			if (pw_match && em_match && name_ok) {
				process.nextTick(function () {
					db("admins").where("email", email).limit(1)
					.then(function (admin) {
						if (admin.constructor === Array && admin.length == 1) {
							return done(null, false);
						} else {
							var new_admin = {};
							new_admin.name = req.body.name;
							new_admin.email = email;
							new_admin.pass = hashPw(password);

							// only if a super user is creating a new user
					    if (req.user && req.user.super) {
						    if (req.body.hasOwnProperty("cjs_perms")) {
						    	if (req.body.cjs_perms == "true") {
						    		new_admin.cjs_perms = true;
						    	}
						    }
						    
						    if (req.body.hasOwnProperty("jail_perms")) {
						    	if (req.body.jail_perms == "true") {
						    		new_admin.jail_perms = true;
						    	}
						    }
						    
						    if (req.body.hasOwnProperty("super")) {
						    	if (req.body.super == "true") {
						    		new_admin.super = true;
						    	}
						    }
					    }

							// insert the new admin user
							db("admins").insert(new_admin)
							.then(function () {

								// query to get the new result, needs to be refactored
								db("admins").where("email", email).limit(1)
								.then(function (admin) {
									if (admin.constructor === Array && admin.length == 1) {
										return done(null, admin[0]);
									} else {
										return done(null, false)
									};
								})
								.catch(function (err) {
									return done(err);
								});

							})
							.catch(function (err) {
								return done(err);
							});
						}
					})
					.catch(function (err) {
						return done(err);
					})
				});				
			} else {
				return done(null)
			}
		})
	);

	passport.use("local-login", new local({
			usernameField: "email",
			passwordField: "pass",
			passReqToCallback: true
		},

		function (req, email, password, done) {
			process.nextTick(function () {

				db("admins").where("email", email).limit(1)
				.then(function (admin) {
					if (admin.constructor === Array && admin.length == 1) {
						admin = admin[0];
						if (validPw(password, admin.pass)) {
							return done(null, admin);

						// fails because bad password
						} else {
							return done(null, false);
						}
					} else {
						return done(null, false);
					}
				})
				.catch(function (err) {
					return done(err);
				})
			});
		})
	);
};





