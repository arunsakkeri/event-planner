(function(){
  var events=Store.load(), lastDeleted=null, sortKey="date", sortDir=1, pendingId=null;
  var $=function(id){return document.getElementById(id);};
  function opts(sel,list){sel.innerHTML=list.map(function(x){return '<option>'+x+'</option>';}).join("");}
  opts($("type"),EVENT_TYPES);opts($("status"),STATUSES);
  $("filter").insertAdjacentHTML("beforeend",STATUSES.map(function(s){return '<option>'+s+'</option>';}).join(""));

  /* friendly toast, with optional undo */
  function toast(text,kind,undo){
    var box=$("msg");
    box.className="alert alert-"+kind+" toast-msg";
    box.innerHTML='<i class="bi '+(kind==="success"?"bi-check-circle-fill":kind==="warning"?"bi-exclamation-circle-fill":"bi-info-circle-fill")+'"></i><span class="flex-grow-1">'+text+'</span>'+
      (undo?'<button class="btn btn-sm btn-light fw-semibold" id="undoBtn">Undo</button>':'');
    if(undo)$("undoBtn").onclick=function(){undo();box.className="alert d-none";};
    clearTimeout(toast._t);toast._t=setTimeout(function(){box.className="alert d-none";},undo?7000:3000);
  }
  function persist(){Store.save(events);}
  function fmtDate(d){var p=d.split("-");var m=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return m[Number(p[1])-1]+" "+Number(p[2])+", "+p[0];}

  function visible(){
    var q=$("search").value.trim().toLowerCase(),f=$("filter").value;
    return events.filter(function(e){
      return (!f||e.status===f)&&(!q||(e.name+" "+e.venue+" "+e.type).toLowerCase().indexOf(q)>-1);
    }).sort(function(a,b){
      var x=a[sortKey],y=b[sortKey];
      if(typeof x==="number")return (x-y)*sortDir;
      return String(x).localeCompare(String(y))*sortDir;
    });
  }

  function actions(e){
    return '<button class="btn btn-sm btn-outline-primary" data-act="edit" data-id="'+e.id+'" aria-label="Edit '+esc(e.name)+'"><i class="bi bi-pencil"></i><span class="d-md-none ms-1">Edit</span></button>'+
           '<button class="btn btn-sm btn-outline-danger" data-act="del" data-id="'+e.id+'" aria-label="Delete '+esc(e.name)+'"><i class="bi bi-trash"></i><span class="d-md-none ms-1">Delete</span></button>';
  }

  function render(){
    var list=visible(),q=$("search").value.trim(),f=$("filter").value;
    /* active filter chips so the user always sees why the list is short */
    var chips=[];
    if(q)chips.push('<span class="filter-chip">Search: '+esc(q)+' <button type="button" data-clear="search" aria-label="Clear search">&times;</button></span>');
    if(f)chips.push('<span class="filter-chip">Status: '+esc(f)+' <button type="button" data-clear="filter" aria-label="Clear status filter">&times;</button></span>');
    $("chips").innerHTML=chips.join(" ");

    if(!list.length){
      var why=events.length?'No events match your search or filter.':'No events yet.';
      var cta=events.length?'<button class="btn btn-outline-primary btn-sm mt-2" data-clear="all">Clear filters</button>'
                           :'<div class="small mt-2">Use the form to add your first event.</div>';
      var empty='<div class="empty"><i class="bi bi-calendar-x"></i>'+why+cta+'</div>';
      $("tblBody").innerHTML='<tr><td colspan="7">'+empty+'</td></tr>';
      $("mList").innerHTML=empty;
    }else{
      $("tblBody").innerHTML=list.map(function(e){
        return '<tr><td><div class="fw-semibold">'+esc(e.name)+'</div><span class="chip">'+esc(e.type)+'</span></td>'+
          '<td class="text-nowrap">'+fmtDate(e.date)+'</td><td>'+esc(e.venue)+'</td>'+
          '<td class="text-end">'+e.guests+'</td><td class="text-end">'+money(e.budget)+'</td>'+
          '<td>'+badge(e.status)+'</td><td class="text-end text-nowrap">'+actions(e)+'</td></tr>';}).join("");
      $("mList").innerHTML=list.map(function(e){
        return '<div class="m-card"><div class="d-flex justify-content-between gap-2"><div class="t">'+esc(e.name)+'</div>'+badge(e.status)+'</div>'+
          '<div class="r"><i class="bi bi-calendar3 me-1"></i>'+fmtDate(e.date)+'</div>'+
          '<div class="r"><i class="bi bi-geo-alt me-1"></i>'+esc(e.venue)+'</div>'+
          '<div class="r"><i class="bi bi-people me-1"></i>'+e.guests+' guests &middot; '+money(e.budget)+'</div>'+
          '<div class="acts">'+actions(e)+'</div></div>';}).join("");
    }
    $("count").textContent=list.length===events.length?
      events.length+(events.length===1?" event":" events"):
      "Showing "+list.length+" of "+events.length+" events";
    document.querySelectorAll(".sortable").forEach(function(th){
      var on=th.dataset.key===sortKey;th.classList.toggle("on",on);
      th.setAttribute("aria-sort",on?(sortDir===1?"ascending":"descending"):"none");
      th.querySelector(".arr").className="arr bi "+(on&&sortDir===-1?"bi-caret-up-fill":"bi-caret-down-fill");
    });
  }

  function clearForm(){
    $("form").reset();$("eid").value="";$("form").classList.remove("was-validated");
    $("formPanel").classList.remove("editing");$("editBanner").classList.add("d-none");
    $("formTitle").innerHTML='<i class="bi bi-plus-circle me-1 text-primary"></i>Create event';
    $("saveBtn").innerHTML='<i class="bi bi-check-lg me-1"></i>Add event';$("cancelBtn").classList.add("d-none");
  }

  $("form").addEventListener("submit",function(ev){
    ev.preventDefault();
    var form=$("form");
    if(!form.checkValidity()){
      form.classList.add("was-validated");
      var bad=form.querySelector(":invalid");if(bad)bad.focus();
      toast("Please fix the highlighted fields.","warning");return;
    }
    var rec={name:$("name").value.trim(),type:$("type").value,date:$("date").value,venue:$("venue").value.trim(),
      guests:Number($("guests").value),budget:Number($("budget").value),status:$("status").value};
    var id=$("eid").value;
    if(id){events=events.map(function(e){return e.id===Number(id)?Object.assign({id:e.id},rec):e;});toast('"'+esc(rec.name)+'" updated.',"success");}
    else{var next=events.reduce(function(m,e){return Math.max(m,e.id);},0)+1;events.push(Object.assign({id:next},rec));toast('"'+esc(rec.name)+'" added.',"success");}
    persist();clearForm();render();$("name").focus();
  });

  function startEdit(e){
    $("eid").value=e.id;$("name").value=e.name;$("type").value=e.type;$("date").value=e.date;
    $("venue").value=e.venue;$("guests").value=e.guests;$("budget").value=e.budget;$("status").value=e.status;
    $("formTitle").innerHTML='<i class="bi bi-pencil-square me-1 text-warning"></i>Update event';
    $("saveBtn").innerHTML='<i class="bi bi-check-lg me-1"></i>Save changes';
    $("cancelBtn").classList.remove("d-none");$("formPanel").classList.add("editing");
    $("editBanner").classList.remove("d-none");
    $("editBanner").innerHTML='<i class="bi bi-info-circle"></i><span>Editing <strong>'+esc(e.name)+'</strong>. Press Esc to cancel.</span>';
    $("formPanel").scrollIntoView({behavior:"smooth",block:"start"});setTimeout(function(){$("name").focus();},300);
  }

  function onAction(ev){
    var b=ev.target.closest("button");if(!b)return;
    if(b.dataset.clear){
      if(b.dataset.clear==="search"||b.dataset.clear==="all")$("search").value="";
      if(b.dataset.clear==="filter"||b.dataset.clear==="all")$("filter").value="";
      render();return;
    }
    if(!b.dataset.act)return;
    var id=Number(b.dataset.id),e=events.find(function(x){return x.id===id;});if(!e)return;
    if(b.dataset.act==="edit")startEdit(e);
    else{pendingId=id;$("delName").textContent=e.name;delModal.show();}
  }
  $("tblBody").addEventListener("click",onAction);
  $("mList").addEventListener("click",onAction);
  $("chips").addEventListener("click",onAction);

  var delModal=new bootstrap.Modal($("delModal"));
  $("confirmDel").addEventListener("click",function(){
    var i=events.findIndex(function(x){return x.id===pendingId;});if(i<0)return;
    lastDeleted={item:events[i],at:i};events.splice(i,1);persist();render();delModal.hide();
    toast('"'+esc(lastDeleted.item.name)+'" deleted.',"warning",function(){
      events.splice(lastDeleted.at,0,lastDeleted.item);persist();render();toast("Event restored.","success");});
  });

  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&$("eid").value){clearForm();toast("Edit cancelled.","info");}
    if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="SELECT"){e.preventDefault();$("search").focus();}
  });
  $("cancelBtn").addEventListener("click",function(){clearForm();});
  $("search").addEventListener("input",render);
  $("filter").addEventListener("change",render);
  document.querySelectorAll(".sortable").forEach(function(th){
    th.addEventListener("click",function(){
      var k=th.dataset.key;if(k===sortKey)sortDir*=-1;else{sortKey=k;sortDir=1;}render();});
    th.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();th.click();}});
  });
  $("resetBtn").addEventListener("click",function(){resetModal.show();});
  var resetModal=new bootstrap.Modal($("resetModal"));
  $("confirmReset").addEventListener("click",function(){events=Store.reset();clearForm();render();resetModal.hide();toast("Sample events restored.","info");});
  render();
})();
