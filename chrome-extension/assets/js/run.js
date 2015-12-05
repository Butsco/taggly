window.taggly = {
	open: false,
	container: undefined,
	body: undefined,

    /*
     * Init Plugin Class
     * Load sidebar
     */
    init: function(object){
    	console.log("[Taggly] taggly.init();");

    	taggly.container = $("<div>").addClass("taggly");
		taggly.container.appendTo(document.body);

		$("<a>").addClass("start")
			    .text("Open")
			    .on('click', taggly.open)
			    .appendTo(taggly.container);

		$("<a>").addClass("close")
			    .text("Close")
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

    	var pageurl = encodeURIComponent(window.location.href);
    	$.get("https://taggly.parseapp.com/api/video-comments/"+pageurl, function(data, status){
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

    	// Open
    	taggly.open = true;
    	$('body').animate({'margin-right':"300px"});
    	taggly.container.animate({'width':"300px"}).addClass('open');
    },

    /*
     * Close the sidebar
     */
    close: function(e){
    	console.log("[Taggly] taggly.close();");

    	e.preventDefault();

    	// Change Taggly status
    	taggly.open = false;
    	$('body').animate({'margin-right':"0"});
    	taggly.container.animate({'width':"50px"}).removeClass('open');
    },

    /*
     * Pause video
     */
    pauseVideo: function(){
    	console.log("[Taggly] taggly.pauseVideo();");
    	var video = $('video').get(0);
    	return video.pause();
    }
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