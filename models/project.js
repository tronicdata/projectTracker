var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
   userId: String,
   title: String,
   url: String,
   purpose: String,
   outcome: String,
   state: String,
   status: String,
   brainstorming: String,
   reference: String,
   tags: String,
   log: [{
    msg: String,
    time: Date
   }],
   archive: Boolean
  });

var Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;