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

  app.get("/admin/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/admin/portal", isLoggedIn, function (req, res) {
    res.render("portal", {admin: {
      name: req.user.name,
      email: req.user.email,
      cjs: req.user.cjs_perms,
      jail: req.user.jail_perms,
      super: req.user.super
    }});
  });

  app.get("/admin/cjs", isLoggedIn, function (req, res) {

    // allow for pagination
    var offset = Number(req.query.offset);
    if (!offset) { offset = 0; }

    // make sure we include or exclude processed
    var proc1 = true;
    var proc2 = false;

    var f = "both";
    if (req.query.hasOwnProperty("filter")) {
      var g = req.query.filter;
      if (g == "complete" || g == "incomplete") f = g;
      if (f == "incomplete") proc1 = null;
      if (f == "complete") proc2 = null;
    }

    if (req.user.cjs_perms) {
      db("clients").limit(25).select().offset(offset).where("processed", proc1).orWhere("processed", proc2)
      .then(function (clients) {
        offset = Number(offset) + 25;
        res.render("cjs", {clients: clients, offset: offset, filter: f})
      }).catch(function (err) {});
    } else {
      res.redirect("/fail/missingperms");
    }
  });

  app.get("/admin/cjs/:cid", isLoggedIn, function (req, res) {
    db("clients").limit(1).where("cid", req.params.cid)
    .then(function (client) {
      res.render("cjs_profile", {client: client[0]});
    }).catch(function (err) {
      res.send(err);
    });
  });

  app.post("/admin/cjs/:cid", isLoggedIn, function (req, res) {
    var cid = req.params.cid;
    if (req.body.hasOwnProperty("archive")) {
      var toBool = true;
      if (req.body.archive == "false") { toBool = false; }

      db("clients").where("cid", cid).update({processed: toBool})
      .then(function (client) {
        res.redirect("/admin/cjs/" + cid);
      }).catch(function (err) {
        res.send(err);
      });
    } else {
      res.redirect("/admin/cjs");
    }
  });

  // fail points
  app.get("/fail/signup", function (req, res) {
    res.send("2 possible errors: Email in use or email and password entries do not line up. <a href='/admin/signup'>Try again.</a>");
  });

  app.get("/fail/login", function (req, res) {
    res.send("Bad login; email or password is incorrect. <a href='/admin/login'>Try again.</a>");
  });

  app.get("/fail/notloggedin", function (req, res) {
    res.send("You are not presently logged in. <a href='/admin'>Click here</a> to return to admin index page.");
  });

  app.get("/fail/missingperms", function (req, res) {
    res.send("You are missing the permissions to access this content. <a href='/admin'>Click here</a> to return to admin index page.");
  });

  // catch all rerouter
  app.get("*", function (req, res) {
    res.redirect("/");
  });

  // utilities
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    else { res.redirect("/fail/notloggedin"); }
  }

};