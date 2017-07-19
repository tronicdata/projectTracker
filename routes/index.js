var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('projects', { title: 'Project Tracker' });
});

router.get('/user/:id', function(req,res,next){
  res.send(req.params.id);
})

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});
/* GET New User page. */
router.get('/addproject', function(req, res) {
    res.render('addproject', { title: 'Add New Project' });
});

router.get('/addLog', function(req, res) {
    //res.render('addproject', { title: 'Add New Project' });
});
/* GET New User page. */
router.get('/projectSingle/:id', function(req, res) {
    res.render('projectSingle', { title: 'update specific project' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});
/* GET Userlist page. */
router.get('/projects/projectlist', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});
/* GET Userlist page. */
router.get('/projects', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    collection.find({},{},function(e,docs){
      res.render('projects', {
          "projects" : docs
      });
    });
});

/* GET Userlist page. */
router.get('/projectlist', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    collection.find({},{},function(e,docs){
        res.render('projectlist', {
            "projectlist" : docs
        });
    });
});

/* GET Userlist page. */
router.get('/projects/logs', function(req, res) {
    var db = req.db;
    var collection = db.get('logs');
    collection.find({},{},function(e,docs){
        /*res.render('projectlist', {
            "logs" : docs
        });*/
        res.json(docs);
    });
});

/*
 * DELETE to deleteproject.
 */
router.delete('/projects/deleteproject/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    var projectToDelete = req.params.id;
    collection.remove({ '_id' : projectToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * PUT to updateproject.
 */
router.put('/projects/updateproject/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    var projectToUpdate = req.params.id;
    var fieldsToUpdate = req.body;
    var time = new Date();
    var logTime = {
      'msg' : fieldsToUpdate.log,
      'time' : time
    }

    delete fieldsToUpdate.log;

    collection.update(
      { '_id' : projectToUpdate },
      {
        $set:fieldsToUpdate,
        $push: {'log': logTime}
      },
      {upsert: true},
      function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
      }
    );


});

router.put('/updateproject/:id', function(req, res){
  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var name = req.body.name;
  var status = req.body.status;
  var ref = req.body.reference;
  var url = req.body.url;
  var tags = req.body.tags;
  var logStr = req.body.log;

  var time = callDate();

  var log = [time, logStr];

  // Set our collection
  var collection = db.get('projects');
  var logCollection = db.get('logs');

  // Submit to the DB
  collection.insert({
      "name" : name,
      "status" : status,
      "reference": ref,
      "url": url,
      "tags": tags

  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
  });

  // Submit to the DB
  logCollection.insert({
      "name" : name,
      "time" : time,
      "msg" : logStr

  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("/");
      }
  });
})

//When an action is taken, log is updated
router.post('/addLog', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var msg = req.body.msg;
    var logId = req.body.logId;
    var time = new Date();

    // Set our collection    var collection = db.get('projects');
    var logCollection = db.get('logs');

    //Generate random ID to attach log to specific id's
    var logId = name + makeid();

    // Submit to the DB
    logCollection.insert({
        "time" : time,
        "msg" : msg,
        "logId": logId

    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/");
        }
    });
});

/* POST to Add User Service */
router.post('/addproject', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var status = req.body.status;
    var ref = req.body.reference;
    var url = req.body.url;
    var tags = req.body.tags;
    var time = new Date();

    // Set our collection
    var collection = db.get('projects');
    var logCollection = db.get('logs');

    var logObj = [
      {
        'msg': 'Project Created!',
        'time': time
      }
    ];


    //Generate random ID to attach log to specific id's
    var logId = name + makeid();

    // Submit to the DB
    collection.insert({
        "name" : name,
        "status" : status,
        "reference": ref,
        "url": url,
        "tags": tags,
        "archive": false,
        "log": logObj

    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
          res.redirect("/");
        }

    });

    // Submit to the DB
    /*
    logCollection.insert({
        "time" : time,
        "msg" : "Project Created!",
        "logId": logId

    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/");
        }
    });*/
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});



function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router;
