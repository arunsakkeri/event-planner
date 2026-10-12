(function(){
  var events=Store.load();
  var $=function(id){return document.getElementById(id);};
  function opts(sel,list){sel.innerHTML=list.map(function(x){return '<option>'+x+'</option>';}).join("");}
  opts($("type"),EVENT_TYPES);opts($("status"),STATUSES);
  $("filter").insertAdjacentHTML("beforeend",STATUSES.map(function(s){return '<option>'+s+'</option>';}).join(""));

  function msg(text,kind){var m=$("msg");m.className="alert alert-"+kind;m.textContent=text;setTimeout(function(){m.className="alert d-none";},3500);}
  function persist(){Store.save(events);}

  // READ
  function render(){
    var q=$("search").value.toLowerCase(),f=$("filter").value;
    var list=events.filter(function(e){
      return (!f||e.status===f)&&(!q||(e.name+" "+e.venue).toLowerCase().indexOf(q)>-1);
    }).sort(function(a,b){return a.date.localeCompare(b.date);});
    $("rows").innerHTML=list.length?list.map(function(e){
      return '<tr><td>'+esc(e.name)+'<div class="small text-muted">'+esc(e.type)+'</div></td><td>'+esc(e.date)+'</td><td>'+esc(e.venue)+
      '</td><td class="text-end">'+e.guests+'</td><td class="text-end">'+money(e.budget)+'</td><td>'+badge(e.status)+
      '</td><td class="text-nowrap"><button class="btn btn-sm btn-outline-primary me-1" data-act="edit" data-id="'+e.id+'">Edit</button>'+
      '<button class="btn btn-sm btn-outline-danger" data-act="del" data-id="'+e.id+'">Delete</button></td></tr>';}).join("")
      :'<tr><td colspan="7" class="text-center text-muted py-4">No events match.</td></tr>';
    $("count").textContent="Showing "+list.length+" of "+events.length+" events";
  }

  function clearForm(){
    $("form").reset();$("eid").value="";$("form").classList.remove("was-validated");
    $("formTitle").textContent="Create event";$("saveBtn").textContent="Add event";$("cancelBtn").classList.add("d-none");
  }

  // CREATE / UPDATE
  $("form").addEventListener("submit",function(ev){
    ev.preventDefault();
    var form=$("form");
    if(!form.checkValidity()){form.classList.add("was-validated");return;}
    var rec={name:$("name").value.trim(),type:$("type").value,date:$("date").value,venue:$("venue").value.trim(),
      guests:Number($("guests").value),budget:Number($("budget").value),status:$("status").value};
    var id=$("eid").value;
    if(id){
      events=events.map(function(e){return e.id===Number(id)?Object.assign({id:e.id},rec):e;});
      msg("Event updated.","success");
    }else{
      var next=events.reduce(function(m,e){return Math.max(m,e.id);},0)+1;
      events.push(Object.assign({id:next},rec));
      msg("Event added.","success");
    }
    persist();clearForm();render();
  });

  $("rows").addEventListener("click",function(ev){
    var b=ev.target.closest("button");if(!b)return;
    var id=Number(b.dataset.id),e=events.find(function(x){return x.id===id;});if(!e)return;
    if(b.dataset.act==="edit"){
      $("eid").value=e.id;$("name").value=e.name;$("type").value=e.type;$("date").value=e.date;
      $("venue").value=e.venue;$("guests").value=e.guests;$("budget").value=e.budget;$("status").value=e.status;
      $("formTitle").textContent="Update event";$("saveBtn").textContent="Save changes";$("cancelBtn").classList.remove("d-none");
      $("name").focus();window.scrollTo({top:0,behavior:"smooth"});
    }else if(confirm('Delete "'+e.name+'"?')){
      // DELETE
      events=events.filter(function(x){return x.id!==id;});persist();render();msg("Event deleted.","warning");
    }
  });

  $("cancelBtn").addEventListener("click",clearForm);
  $("search").addEventListener("input",render);
  $("filter").addEventListener("change",render);
  $("resetBtn").addEventListener("click",function(){
    if(confirm("Restore the original sample events?")){events=Store.reset();clearForm();render();msg("Sample data restored.","info");}
  });
  render();
})();
