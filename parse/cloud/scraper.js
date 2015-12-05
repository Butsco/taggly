Parse.Cloud.afterSave("Product", function(request) {

    var date1 = new Date();
    var date2 = new Date(request.object.updatedAt);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());

    if(timeDiff > (20*1)){

        query = new Parse.Query("Product");
        query.get(request.object.id, {
            success: function(product) {
  
                console.log(product.get('productUrl'));

                Parse.Cloud.httpRequest({
                    url: "https://graph.facebook.com",
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: {
                        'id': product.get('productUrl'),
                        'scrape': true
                    },
                    success: function (httpResponse) {
                        console.log(httpResponse);

                        product.set("title", httpResponse.data.title);
                        product.set("description", httpResponse.data.description);
                        product.set("sitename", httpResponse.data.site_name);
                        product.set("type", httpResponse.data.type);
                        product.set("imageUrl", httpResponse.data.image[0].url);
                        product.save();
                    },
                    error:function (httpResponse) {
                        console.error('Request failed with response code ' + httpResponse.status);
                    }
                });
               
            },
            error: function(error) {
                console.error("Got an error " + error.code + " : " + error.message);
            }
        });
        
    }else{
        console.log("Already updated "+timeDiff+"s ago.");
    }
});