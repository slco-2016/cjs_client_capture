module.exports = function (app, db, passport) {
  app.get("/", function (req, res) {
    res.render("index");
  });

  app.get("/new_entry", function (req, res) {
    res.render("entry");
  });

  app.post("/new_entry", function (req, res) {
    var b = {};
    b.first = req.body.first,
    b.middle = req.body.middle,
    b.last = req.body.last,
    b.gender = req.body.gender,
    b.year = req.body.year,
    b.month = req.body.month,
    b.day = req.body.day,
    b.phone = req.body.phone,
    b.email = req.body.email,
    b.address = req.body.address,
    b.charge_lvl = req.body.charge_lvl,
    b.offense_1 = req.body.offense_1,
    b.offense_2 = req.body.offense_2,
    b.offense_3 = req.body.offense_3,
    b.warrant = req.body.warrant,
    b.case_num = req.body.case_num,
    b.otn = req.body.otn,
    b.so = req.body.so,
    b.officer_id = req.body.officer_id,
    b.police_dept = req.body.police_dept,
    b.notes = req.body.notes;

    // make sure required variables are included
    var ok = true;
    if ( !(b.first && (b.first.length >= 1)) ) ok = false;
    if ( !(b.last && (b.last.length >= 1)) ) ok = false;

    if ( b.warrant == "true" ) { b.warrant = true; }
    else { b.warrant = false; };

    // remove keys that did not have entries and keep them from being included in the insert
    Object.keys(b).forEach(function (k) {
      if (b[k] == undefined || b[k] == "") {
        delete b[k];
      }
    });

    // remove specific year, month, day variables and create a DOB key value
    var hasDateData = b.hasOwnProperty("year") && b.hasOwnProperty("month") && b.hasOwnProperty("day");
    if (hasDateData) {
      b.year = Number(b.year);
      b.month = Number(b.month) - 1;
      b.day = Number(b.day);
      
      var d = new Date(b.year, b.month, b.day);
      b["dob"] = d;

      delete b.year;
      delete b.month;
      delete b.day;
    }

    if (ok) {
      db("clients").insert(b).then(function () {
        res.send("Succesful entry. <a href='/new_entry'>Return to entry page.</a>")
      });
    } else {
      res.send("Missing required entries. <a href='/new_entry'>Try again.</a>")
    }
  });

  app.get("/admin", function (req, res) {
    res.render("admin");
  });

  app.get("/admin/portal", isLoggedIn, function (req, res) {
    res.send("sahweet")
  });

  app.get("/admin/signup", function (req, res) {
    res.render("signup");
  });

  app.post("/admin/signup", passport.authenticate("local-signup", {
      successRedirect: "/admin/portal",
      failureRedirect: "/fail/signup"
    })
  );

  app.get("/admin/login", function (req, res) {
    res.render("login");
  });

  app.post("/admin/login", passport.authenticate("local-login", {
      successRedirect: "/admin/portal",
      failureRedirect: "/fail/login"
    })
  );

  // fail points
  app.get("/fail/signup", function (req, res) {
    res.send("2 possible errors: Email in use or email and password entries do not line up. <a href='/admin/signup'>Try again.</a>");
  });

  app.get("/fail/login", function (req, res) {
    res.send("Bad login; email or password is incorrect. <a href='/admin/login'>Try again.</a>");
  });

  // utilities
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    else { res.redirect('/'); }
  }

};