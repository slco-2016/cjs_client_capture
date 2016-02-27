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
				usernameField: "name",
				passwordField: "pass",
				passReqToCallback: true
			},

			function (req, email, password, done) {
				process.nextTick(function () {

					db("admins").where("aid", id).limit(1)
					.then(function (row) {
						if (rows.constructor === Array) { row = row[0]; }
						done(null, rows);
					})
					.catch(function (err) {
						done(err, null);
					})

					User.findOne({ "local.email" :  email }, function(err, user) {
						if (err)
							return done(err);

						if (user) {
							return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
						} else {
							var newUser = new User();

							newUser.local.email = email;
							newUser.local.password = newUser.generateHash(password);

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});
				});
			})
		);
};