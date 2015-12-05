Parse.Cloud.beforeSave("Product", function(request, response) {
    Parse.Cloud.httpRequest({
        url: "https://graph.facebook.com",
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: {
            'id': request.object.get('productUrl'),
            'scrape': true
        },
        success: function (httpResponse) {
            console.log(httpResponse);

            request.object.set("title", httpResponse.data.title);
            request.object.set("description", httpResponse.data.description);
            request.object.set("sitename", httpResponse.data.site_name);
            request.object.set("type", httpResponse.data.type);
            request.object.set("imageUrl", httpResponse.data.image[0].url);
            response.success();
        },
        error:function (httpResponse) {
            response.error('Request failed with response code ' + httpResponse.status);
        }
    });
});