window.taggly = {
	open: false,
	container: undefined,
    overlay: undefined,
	body: undefined,

    /*
     * Init Plugin Class
     * Load sidebar
     */
    init: function(object){
    	console.log("[Taggly] taggly.init();");

    	taggly.container = $("<div>").addClass("taggly");
        taggly.container.appendTo(document.body);

        taggly.overlay = $("<div>").addClass("taggly-overlay");
        taggly.overlay.appendTo(document.body);


		$("<a>").addClass("start")
			    .text("Taggly")
			    .on('click', taggly.open)
			    .appendTo(taggly.container);

		$("<a>").addClass("close")
			    .text("+")
			    .on('click', taggly.close)
			    .appendTo(taggly.container);

		taggly.body = $("<div>").addClass("body");
		taggly.body.appendTo(taggly.container);

		// Send pageview
		taggly.pageview();
    },

    /*
     *	PageView
     */
    pageview: function(){
    	console.log("[Taggly] taggly.pageview();");

        var pageurl = window.location.href;
        var type = "video-comments";

        if(window.location.hostname.indexOf("youtube") > -1 && window.location.search.indexOf("v=") > -1){
            var video_id = window.location.search.split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
                pageurl = "https://www.youtube.com/watch?v="+video_id;
            }
        }
        
        if(window.location.hostname.indexOf("zalando") > -1){
            type = "ecommerce";
        }
        
    	var date = new Date();
    	$.get("https://taggly.parseapp.com/api/"+type+"/"+encodeURIComponent(pageurl)+"?"+date.getTime(), function(data, status){
    		if(status == 'success'){
	        	console.log(data);
		      taggly.body.html(data);
		    } 
	    });

    },

    /*
     * Open the sidebar
     */
    open: function(e){
    	console.log("[Taggly] taggly.open();");

    	e.preventDefault();

        // Pause Video
        if(document.getElementsByTagName('video').length > 0){
            document.getElementsByTagName('video')[0].pause();
        }

    	// Open
    	taggly.open = true;
        taggly.container.addClass('open');
    },

    /*
     * Close the sidebar
     */
    close: function(e){
    	console.log("[Taggly] taggly.close();");

    	e.preventDefault();

        // Play Video
        if(document.getElementsByTagName('video').length > 0){
            document.getElementsByTagName('video')[0].play();
        } 

    	// Change Taggly status
    	taggly.open = false;
    	taggly.container.removeClass('open');
    },

} 


console.log("loaded");
$(function(){
	console.log("[Taggly] I'm loaded on this page");
	taggly.init();

	var currentURL = window.location.href;
    setInterval(function(){
        if(currentURL != window.location.href){
            currentURL = window.location.href;
            taggly.pageview();
        }
    }, 500);
});	