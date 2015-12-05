Parse.Cloud.afterSave("Product", function(request) {

    query = new Parse.Query("Product");
    query.get(request.object.id, {
        success: function(product) {


            var url = "http://www.ebay.com/itm/Microsoft-Surface-Pro-3-12-Tablet-256GB-SSD-Intel-Core-i7-Haswell-8GB-RAM-/281656969697";

            $.getJSON("//query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20html%20WHERE%20url=%27" + encodeURIComponent(url) + "%27%20AND%20xpath=%27descendant-or-self::meta%27&format=json&callback=?", function(data) {
                console.log(data);
              // filter returned `results.meta` array for
              // object having property `property`:`og:*` `meta` elements ;
              // and has `property` `og:image` 
              var res = $.grep(data.query.results.meta, function(image, key) {
                return image.hasOwnProperty("property") && image.property === "og:image"
              });
              // if object having property `og:image` returned , do stuff
              if (res.length > 0) {
                console.log(res[0].property);
                $("body").append(res[0].content);
              } else {
                // else, log notification
                console.log("og:image not found")
              };

});




            product.set("title", "TEST");
            product.save();
        },
        error: function(error) {
            console.error("Got an error " + error.code + " : " + error.message);
        }
    });
});