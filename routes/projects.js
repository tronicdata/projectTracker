var express = require('express');
var router = express.Router();

/* GET projects listing. */
router.get('/projectlist', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * DELETE to deleteproject.
 */
router.delete('/deleteproject/:id', function(req, res) {
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
router.put('/updateproject/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    var projectToUpdate = req.params.id;
    var fieldsToUpdate = req.body;
    collection.update({ '_id' : projectToUpdate }, {$set:fieldsToUpdate},function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
