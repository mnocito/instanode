var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
  createdby: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: false
  },
  date: {
    type: String,
    default: new Date().toString()
  },
  likedby: {
    type: Array,
    default: []
  },
  comments: {
    type: Array,
    default: []
  }, 
  location: {
    type: String
  }
});
postSchema.methods.liked = function(user) {
  return this.likedby.includes(user);
}

mongoose.model('Post', postSchema);