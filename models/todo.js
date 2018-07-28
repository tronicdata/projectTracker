var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
   userId: String,
   projectId: String,
   taskTitle: String,
   priority: Number,
   difficulty: Number,
   context: String,
   state: String,
   updated_at: Date,
   created_at: Date,
   archive: Boolean
  });

var Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;