var elt = document.createElement("script");
elt.innerHTML = "window.taggly = {currentTime:function(){ return document.getElementsByTagName('video')[0].currentTime }};";
document.head.appendChild(elt);