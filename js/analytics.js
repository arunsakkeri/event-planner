(function(){
  var ev=Store.load();
  var C={indigo:"#4f46e5",violet:"#7c3aed",coral:"#ff6b6b",amber:"#f59e0b",mint:"#10b981",sky:"#22d3ee"};
  var palette=[C.indigo,C.coral,C.mint,C.amber,C.violet,C.sky];
  Chart.defaults.font.family="Inter,system-ui,sans-serif";
  Chart.defaults.color="#6b7280";
  var base={responsive:true,maintainAspectRatio:false};
  var grid={grid:{color:"#eef0f6"},border:{display:false}};

  var budgetTotal=ev.reduce(function(a,e){return a+Number(e.budget);},0);
  var guestTotal=ev.reduce(function(a,e){return a+Number(e.guests);},0);
  var avgBudget=ev.length?Math.round(budgetTotal/ev.length):0;
  var perGuest=guestTotal?Math.round(budgetTotal/guestTotal):0;
  var kpis=[["g1","bi-cash-stack",money(budgetTotal),"Total budget"],["g2","bi-people",guestTotal.toLocaleString(),"Total guests"],
            ["g3","bi-calculator",money(avgBudget),"Average per event"],["g4","bi-person-badge",money(perGuest),"Cost per guest"]];
  document.getElementById("kpis").innerHTML=kpis.map(function(k){
    return '<div class="col-6 col-lg-3"><div class="kpi '+k[0]+'"><i class="bi '+k[1]+' mb-1"></i><div class="v">'+k[2]+'</div><div class="t">'+k[3]+'</div></div></div>';}).join("");

  var byType=EVENT_TYPES.map(function(t){
    return ev.filter(function(e){return e.type===t;}).reduce(function(a,e){return a+Number(e.budget);},0);});
  new Chart(document.getElementById("typeChart"),{type:"bar",
    data:{labels:EVENT_TYPES,datasets:[{label:"Budget",data:byType,backgroundColor:palette,borderRadius:8,maxBarThickness:60}]},
    options:Object.assign({},base,{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return money(c.parsed.y);}}}},
      scales:{y:{beginAtZero:true,ticks:{callback:function(v){return "$"+(v/1000)+"k";}},grid:grid.grid,border:grid.border},x:{grid:{display:false},border:grid.border}}})});

  new Chart(document.getElementById("budgetChart"),{type:"doughnut",
    data:{labels:Object.keys(BUDGET_BREAKDOWN),datasets:[{data:Object.values(BUDGET_BREAKDOWN),backgroundColor:palette,borderWidth:3,borderColor:"#fff"}]},
    options:Object.assign({},base,{cutout:"62%",plugins:{legend:{position:"right",labels:{boxWidth:10,usePointStyle:true,pointStyle:"circle",padding:12}},
      tooltip:{callbacks:{label:function(c){return c.label+": "+c.parsed+"%";}}}}})});

  var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var perMonth=months.map(function(_,i){
    return ev.filter(function(e){return Number(e.date.slice(5,7))-1===i&&e.status!=="Cancelled";})
      .reduce(function(a,e){return a+Number(e.guests);},0);});
  new Chart(document.getElementById("monthChart"),{type:"line",
    data:{labels:months,datasets:[{label:"Guests",data:perMonth,borderColor:C.indigo,backgroundColor:"rgba(79,70,229,.12)",
      fill:true,tension:.35,pointBackgroundColor:C.indigo,pointRadius:4,pointHoverRadius:6,borderWidth:3}]},
    options:Object.assign({},base,{plugins:{legend:{display:false}},
      scales:{y:{beginAtZero:true,grid:grid.grid,border:grid.border},x:{grid:{display:false},border:grid.border}}})});

  var byStatus=STATUSES.map(function(s){return ev.filter(function(e){return e.status===s;}).length;});
  new Chart(document.getElementById("statusChart"),{type:"bar",
    data:{labels:STATUSES,datasets:[{data:byStatus,backgroundColor:[C.indigo,C.mint,"#9ca3af",C.coral],borderRadius:8,maxBarThickness:36}]},
    options:Object.assign({},base,{indexAxis:"y",plugins:{legend:{display:false}},
      scales:{x:{beginAtZero:true,ticks:{precision:0},grid:grid.grid,border:grid.border},y:{grid:{display:false},border:grid.border}}})});
})();
