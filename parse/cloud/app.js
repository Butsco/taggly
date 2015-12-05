
// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
 app = express();


// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


// Comment example form
app.get('/comment', function(req, res) {
  res.render('comment');
});

// Get comments for video
// https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DsGbxmsDFVnE
app.get('/api/video-comments/:videoUrl?', function(req, res) {
  
  // Parameters
  var videoUrl = req.param('videoUrl');
  videoUrl = decodeURIComponent(videoUrl);
  
  // Get root comments
  var rootCommentQuery = new Parse.Query('Comment');
  rootCommentQuery.equalTo('videoUrl', videoUrl);
  
  // Get reply comments
  var replyCommentQuery = new Parse.Query('Comment');
  replyCommentQuery.matchesQuery('parentComment', rootCommentQuery);
  
  // Create compound query
  var query = Parse.Query.or(rootCommentQuery, replyCommentQuery);
  query.include('user');
  query.include('product');
  query.ascending('createdAt');
  
  // Execute the query
  query.find().then(function(results) {
    
    var commentArray = [];
    
    for(var i=0; i<results.length; i++){
      
      // Check if there is a product linked to this comment
      var productUrl = null;
      if(results[i].get('product')){
        productUrl = results[i].get('product').get('productUrl');
      }
      
      // Create the comment
      var commentObject = {
        id: results[i].id,
        productUrl: productUrl,
        description: results[i].get('description'),
        author: {
          id: results[i].get('user').id,
          username: results[i].get('user').get('username'),
          picture: results[i].get('user').get('picture'),
        }
      };
      
      // Push to the comment array
      commentArray.push(commentObject);
    }
    
    return commentArray;

  }).then(function(commentArray) {
    
    // Render template
    res.render('video-comments', {comments: commentArray});
    
  });

});


// Attach the Express app to Cloud Code.
app.listen();
