var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    unique: true,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model('Article', ArticleSchema);

// Export the Article model
module.exports = Article;

// db.mongoscraper.insertMany({
//   title: 'New Batman Game Is Called Gotham Knights, Out Next Year',
//   link:
//     'https://kotaku.com/new-batman-game-is-called-gotham-knights-out-next-year-1844813454',
//   note: ''
// });
