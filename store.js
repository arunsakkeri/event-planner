// Tiny storage helper: events live in localStorage so edits survive page changes
var Store=(function(){
  var KEY="eventPlannerEvents.v1";
  function load(){
    try{var raw=localStorage.getItem(KEY);if(raw)return JSON.parse(raw);}catch(e){}
    return SEED_EVENTS.slice();
  }
  function save(list){try{localStorage.setItem(KEY,JSON.stringify(list));}catch(e){}}
  function reset(){try{localStorage.removeItem(KEY);}catch(e){}return SEED_EVENTS.slice();}
  return {load:load,save:save,reset:reset};
})();
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function money(n){return "$"+Number(n).toLocaleString();}
function badge(s){return '<span class="badge badge-'+s.toLowerCase()+'">'+esc(s)+'</span>';}
