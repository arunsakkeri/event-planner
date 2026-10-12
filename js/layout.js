(function(){
  var pages=[["index.html","Home"],["manageevents.html","Manage Events"],["analytics.html","Analytics"],["aboutus.html","About Us"]];
  var here=location.pathname.split("/").pop()||"index.html";
  var links=pages.map(function(p){
    return '<li class="nav-item"><a class="nav-link'+(p[0]===here?' active" aria-current="page':'')+'" href="'+p[0]+'">'+p[1]+'</a></li>';
  }).join("");
  document.getElementById("site-nav").innerHTML=
   '<nav class="navbar navbar-expand-md navbar-dark"><div class="container">'+
   '<a class="navbar-brand fw-bold" href="index.html">Eventually Planner</a>'+
   '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>'+
   '<div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav ms-auto">'+links+'</ul></div></div></nav>';
  document.getElementById("site-footer").innerHTML=
   '<footer><div class="container d-flex flex-wrap justify-content-between"><span>ISM 6225 Assignment 1 &middot; Event Planner</span><span>Built by Arun Kumar Sakkeri &middot; <a href="aboutus.html">About</a></span></div></footer>';
})();
