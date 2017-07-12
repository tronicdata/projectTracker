var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    collection.update({ '_id' : projectToUpdate }, {$set:fieldsToUpdate},function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.put('/updateproject/:id', function(req, res){
  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var name = req.body.name;
  var status = req.body.status;
  var ref = req.body.reference;

  // Set our collection
  var collection = db.get('projects');

  // Submit to the DB
  collection.insert({
      "name" : name,
      "status" : status,
      "reference": ref

  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("projectlist");
      }
  });
})

/* POST to Add User Service */
router.post('/addproject', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var status = req.body.status;
    var ref = req.body.reference;

    // Set our collection
    var collection = db.get('projects');

    // Submit to the DB
    collection.insert({
        "name" : name,
        "status" : status,
        "reference": ref

    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("projectlist");
        }
    });
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
module.exports = router;
