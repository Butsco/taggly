var elt = document.createElement("script");
elt.innerHTML = "window.taggly = {";
elt.innerHTML += "currentTime: function(){ return document.getElementsByTagName('video')[0].currentTime; },";
elt.innerHTML += "pause: function(){ return document.getElementsByTagName('video')[0].pause(); },";
elt.innerHTML += "forward: function(){ document.getElementsByTagName('video')[0].pause(); return document.getElementsByTagName('video')[0].currentTime = document.getElementsByTagName('video')[0].currentTime + 1; },";
elt.innerHTML += "backward: function(){ document.getElementsByTagName('video')[0].pause(); return document.getElementsByTagName('video')[0].currentTime = document.getElementsByTagName('video')[0].currentTime - 1; }";
elt.innerHTML += "};";
document.head.appendChild(elt);