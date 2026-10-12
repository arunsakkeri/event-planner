(function(){
  var pages=[["index.html","Home","bi-house"],["manageevents.html","Manage Events","bi-calendar-check"],["analytics.html","Analytics","bi-bar-chart-line"],["aboutus.html","About Us","bi-person"]];
  var here=location.pathname.split("/").pop()||"index.html";
  var links=pages.map(function(p){
    return '<li class="nav-item"><a class="nav-link'+(p[0]===here?' active" aria-current="page':'')+'" href="'+p[0]+'"><i class="bi '+p[2]+' me-1"></i>'+p[1]+'</a></li>';
  }).join("");
  document.getElementById("site-nav").innerHTML=
   '<nav class="navbar navbar-expand-md navbar-dark"><div class="container">'+
   '<a class="navbar-brand" href="index.html"><i class="bi bi-stars"></i>Eventually</a>'+
   '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>'+
   '<div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav ms-auto">'+links+'</ul></div></div></nav>';
  document.getElementById("site-footer").innerHTML=
   '<footer><div class="container"><div class="row g-4"><div class="col-md-5"><div class="h5 text-white"><i class="bi bi-stars text-danger me-1"></i>Eventually</div><p class="mb-0">A simple event planner for tracking dates, guests and budgets.</p></div>'+
   '<div class="col-6 col-md-3"><div class="text-white fw-semibold mb-2">Pages</div>'+pages.map(function(p){return '<div><a href="'+p[0]+'">'+p[1]+'</a></div>';}).join("")+'</div>'+
   '<div class="col-6 col-md-4"><div class="text-white fw-semibold mb-2">Project</div><div>ISM 6225 Assignment 1</div><div><a href="https://github.com/arunsakkeri/event-planner" target="_blank" rel="noopener"><i class="bi bi-github me-1"></i>Source on GitHub</a></div></div></div>'+
   '<hr style="border-color:rgba(255,255,255,.15)"><div class="small">Built by Arun Kumar Sakkeri. Sample data only.</div></div></footer>';
})();
