var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Project = require('../models/project');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('userLogin', { title: 'Login' });
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
router.get('/projects/projectlist', function(req, res, next) {
    /*var db = req.db;
    var collection = db.get('projects');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });*/
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            Project.find({ userId: req.session.userId })
            .exec(function (error, docs) {
              if (error) {
                return next(error);
              } else {
                
                return res.json(docs);
                
              }
            });
        }
      }
    });
});
/* GET Userlist page. */
router.get('/projects', function(req, res, next) {
    /*var db = req.db;
    console.log(req);
    var collection = db.get('projects');
    collection.find({},{},function(e,docs){
      res.render('projects', {
          "projects" : docs,
      });
    });*/
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            Project.find({ userId: req.session.userId })
            .exec(function (error, docs) {
              if (error) {
                return next(error);
              } else {
                
                return res.render('projects', {
                    "projects": docs
                });
                
              }
            });
        }
      }
    });
    
});

/* GET projectlist page. */
router.get('/projectlist', function(req, res, next) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            Project.find({ userId: req.session.userId })
            .exec(function (error, docs) {
              if (error) {
                return next(error);
              } else {
                
                return res.render('projectlist', {
                    "projectlist": docs
                });
                
              }
            });
        }
      }
    });
});



//User Login Data
//POST route for updating data
router.post('/', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
    }
  
    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {
  
      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }
  
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
  
    } else if (req.body.logemail && req.body.logpassword) {
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  })
  
  // GET route after registering
  router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
           
            return  res.render('userProfile', { user: user });
          }
        }
      });
  });
  
  // GET for logout logout
  router.get('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });




/*
 * DELETE to deleteproject.
 */
router.delete('/projects/deleteproject/:id', function(req, res) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            Project.find()
            .exec(function (error, docs) {
              if (error) {
                return next(error);
              } else {
            
                Project.findByIdAndRemove( req.params.id, function(){
                    res.send((error === null) ? { msg: '' } : { msg:'error: ' + error });
                } );
                
              }
            });
        }
      }
    });
});

/*
 * PUT to updateproject.
 */
router.put('/projects/updateproject/:id', function(req, res, next) {
    var fieldsToUpdate = req.body;

    var time = new Date();
    var logTime = {
        'msg' : fieldsToUpdate.log,
        'time' : time
    }

    delete fieldsToUpdate.log;

    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            Project.find()
            .exec(function (error, docs) {
              if (error) {
                return next(error);
              } else {
            
                Project.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: fieldsToUpdate,
                        $push: {"log": logTime}
                    }, function (error, project) {
                    if (error) {
                        return next(error);
                    } else {
                        res.send((error === null) ? { msg: '' } : { msg:'error: ' + error });
                    }
                });
                
              }
            });
        }
      }
    });

});

/* POST to Add Project Service */
router.post('/addproject', function(req, res, next) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            Project.find()
            .exec(function (error, docs) {
              if (error) {
                return next(error);
              } else {
                
                var projectData = {
                    userId: req.session.userId,
                    title: req.body.title,
                    url: req.body.url,
                    status: "new",
                    reference: req.body.reference,
                    tags: req.body.tags,
                }
            
                Project.create(projectData, function (error, project) {
                if (error) {
                    return next(error);
                } else {
                    return res.redirect('/projects');
                }
                });
                
              }
            });
        }
      }
    });
    
});

module.exports = router;
