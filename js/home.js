(function(){
  var ev=Store.load();
  var total=ev.reduce(function(a,e){return a+Number(e.budget);},0);
  var guests=ev.reduce(function(a,e){return a+Number(e.guests);},0);
  var upcoming=ev.filter(function(e){return e.status==="Planned"||e.status==="Confirmed";}).sort(function(a,b){return a.date.localeCompare(b.date);});
  var stats=[[ev.length,"Total events"],[upcoming.length,"Upcoming"],[guests.toLocaleString(),"Guests hosted or expected"],[money(total),"Combined budget"]];
  document.getElementById("stats").innerHTML=stats.map(function(s){
    return '<div class="col-6 col-md-3"><div class="stat"><div class="num">'+s[0]+'</div><div>'+s[1]+'</div></div></div>';}).join("");
  document.getElementById("upcoming").innerHTML=upcoming.length?upcoming.map(function(e){
    return '<tr><td>'+esc(e.name)+'</td><td>'+esc(e.date)+'</td><td>'+esc(e.venue)+'</td><td>'+badge(e.status)+'</td></tr>';}).join("")
    :'<tr><td colspan="4" class="text-muted">No upcoming events. Add one on the Manage Events page.</td></tr>';
})();
