var Buffer = require('buffer').Buffer;

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

Parse.Cloud.beforeSave("Comment", function(request, response) {
    if(request.object.get('videoUrl')){
      
      var url = request.object.get('videoUrl'); 
      var video_id = url.split('v=')[1];
      
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
      
      Parse.Cloud.httpRequest({
           url: 'https://www.googleapis.com/youtube/v3/videos?id='+video_id+'&key=AIzaSyD4a-4m-OWQZqYfDIKqvhPuhXFVuh6hYEs&fields=items(snippet(title))&part=snippet',
           method: 'GET',
           success: function (httpResponse) {
               request.object.set("videoTitle", httpResponse.data.items[0].snippet.title);
               response.success();
           },
           error:function (httpResponse) {
               response.error('Request failed with response code ' + httpResponse.status);
           }
       }); 
    }else{
      response.success();
    }
});