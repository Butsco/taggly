Parse.Cloud.afterSave("Product", function(request) {

     console.log(request);

     
    query = new Parse.Query("Product");
    query.get(request.object.get("Product").id, {
        success: function(product) {

            console.log(product);
            //post.increment("comments");
            post.save();
        },
        error: function(error) {
            console.error("Got an error " + error.code + " : " + error.message);
        }
    });
});