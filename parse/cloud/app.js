
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

      var isReply = false;
      if(results[i].get('parentComment')){
        isReply = true;
      }
      
      var product = {};
      if(results[i].get('product')){
        product.url = results[i].get('product').get('productUrl');
        product.title = results[i].get('product').get('title');
        product.description = results[i].get('product').get('description');
        product.image = results[i].get('product').get('imageUrl');
      }
      
      // Create the comment
      var commentObject = {
        id: results[i].id,
        timestamp: results[i].get('timestamp'),
        description: results[i].get('description'),
        isReply: isReply,
        author: {
          id: results[i].get('user').id,
          username: results[i].get('user').get('username'),
          picture: results[i].get('user').get('picture')
        },
        product: product
      };
      
      // Push to the comment array
      commentArray.push(commentObject);
    }
    
    return commentArray;

  }).then(function(commentArray) {
    
    // Render template
    res.render('video-comments', {comments: commentArray, videoUrl: videoUrl});
    
  });

});



// Get ecommmerce for product
// https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DsGbxmsDFVnE
app.get('/api/ecommerce/:videoUrl?', function(req, res) {
  
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

      var isReply = false;
      if(results[i].get('parentComment')){
        isReply = true;
      }
      
      var product = {};
      if(results[i].get('product')){
        product.url = results[i].get('product').get('productUrl');
        product.title = results[i].get('product').get('title');
        product.description = results[i].get('product').get('description');
        product.image = results[i].get('product').get('imageUrl');
      }
      
      // Create the comment
      var commentObject = {
        id: results[i].id,
        timestamp: results[i].get('timestamp'),
        description: results[i].get('description'),
        isReply: isReply,
        author: {
          id: results[i].get('user').id,
          username: results[i].get('user').get('username'),
          picture: results[i].get('user').get('picture')
        },
        product: product
      };
      
      // Push to the comment array
      commentArray.push(commentObject);
    }
    
    return commentArray;

  }).then(function(commentArray) {
    
    // Render template
    res.render('video-comments', {comments: commentArray, videoUrl: videoUrl});
    
  });

});


// Attach the Express app to Cloud Code.
app.listen();
