(function(){
  var ev=Store.load();
  var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function parts(d){var p=d.split("-");return {m:MON[Number(p[1])-1]||"",d:Number(p[2])||""};}
  var total=ev.reduce(function(a,e){return a+Number(e.budget);},0);
  var guests=ev.reduce(function(a,e){return a+Number(e.guests);},0);
  var upcoming=ev.filter(function(e){return e.status==="Planned"||e.status==="Confirmed";}).sort(function(a,b){return a.date.localeCompare(b.date);});

  var stats=[["g1","bi-calendar-event",ev.length,"Total events"],["g2","bi-hourglass-split",upcoming.length,"Upcoming"],
             ["g3","bi-people",guests.toLocaleString(),"Total guests"],["g4","bi-cash-stack",money(total),"Combined budget"]];
  document.getElementById("stats").innerHTML=stats.map(function(s){
    return '<div class="col-6 col-lg-3"><div class="stat"><div class="ico '+s[0]+'"><i class="bi '+s[1]+'"></i></div><div><div class="num">'+s[2]+'</div><div class="lbl">'+s[3]+'</div></div></div></div>';}).join("");

  var n=upcoming[0];
  document.getElementById("nextCard").innerHTML=n?
    '<div class="label">Next up</div><div class="title mb-1">'+esc(n.name)+'</div>'+
    '<div class="row-i"><i class="bi bi-calendar3"></i>'+esc(n.date)+'</div>'+
    '<div class="row-i"><i class="bi bi-geo-alt"></i>'+esc(n.venue)+'</div>'+
    '<div class="row-i"><i class="bi bi-people"></i>'+n.guests+' guests</div>'+
    '<div class="d-flex justify-content-between small mt-3"><span>Budget</span><strong>'+money(n.budget)+'</strong></div>'+
    '<div class="progress mt-1" role="progressbar" aria-label="Planning progress"><div class="progress-bar" style="width:'+(n.status==="Confirmed"?75:35)+'%"></div></div>'+
    '<div class="small text-muted mt-1">'+esc(n.status)+'</div>'
    :'<div class="title">No upcoming events</div><div class="meta">Add one on the Manage Events page.</div>';

  document.getElementById("upcoming").innerHTML=upcoming.length?upcoming.slice(0,6).map(function(e){
    var p=parts(e.date);
    return '<div class="col-md-6 col-lg-4"><div class="ev-card"><div class="date-box"><div class="m">'+p.m+'</div><div class="d">'+p.d+'</div></div><div>'+
      '<span class="chip mb-1">'+esc(e.type)+'</span><h3>'+esc(e.name)+'</h3>'+
      '<div class="meta"><i class="bi bi-geo-alt me-1"></i>'+esc(e.venue)+'</div>'+
      '<div class="meta"><i class="bi bi-people me-1"></i>'+e.guests+' guests &middot; '+money(e.budget)+'</div>'+
      '<div class="mt-2">'+badge(e.status)+'</div></div></div></div>';}).join("")
    :'<div class="col-12 text-muted">No upcoming events yet.</div>';
})();
