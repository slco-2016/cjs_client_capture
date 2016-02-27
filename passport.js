var local = require("passport-local").Strategy;
var db = require("./db");

// expose this function to our app using module.exports
module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		db("admins").where("aid", id).limit(1)
		.then(function (row) {
			if (rows.constructor === Array) { row = row[0]; }
			done(null, rows);
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
			process.nextTick(function () {

				db("admins").where("email", email).limit(1)
				.then(function (admin) {
					if (admin.constructor === Array && admin.length == 1) {
						return done(null, false);
					} else {
						var new_admin = {};
						new_admin.email = email;
						new_admin.password = password;

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
						if (admin.password == password) {
							return done(null, user);
							
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





