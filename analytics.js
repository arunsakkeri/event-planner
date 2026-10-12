(function(){
  var ev=Store.load();
  var colors=["#14213d","#0f9d8a","#f4a259","#5b8e7d","#bc4b51","#8da9c4"];
  var opts={responsive:true,maintainAspectRatio:false};

  var counts=EVENT_TYPES.map(function(t){return ev.filter(function(e){return e.type===t;}).length;});
  new Chart(document.getElementById("typeChart"),{type:"bar",
    data:{labels:EVENT_TYPES,datasets:[{label:"Events",data:counts,backgroundColor:colors[1]}]},
    options:Object.assign({},opts,{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}})});

  new Chart(document.getElementById("budgetChart"),{type:"doughnut",
    data:{labels:Object.keys(BUDGET_BREAKDOWN),datasets:[{data:Object.values(BUDGET_BREAKDOWN),backgroundColor:colors}]},
    options:Object.assign({},opts,{plugins:{legend:{position:"bottom"}}})});

  var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var perMonth=months.map(function(_,i){
    return ev.filter(function(e){return Number(e.date.slice(5,7))-1===i&&e.status!=="Cancelled";})
      .reduce(function(a,e){return a+Number(e.guests);},0);});
  new Chart(document.getElementById("monthChart"),{type:"line",
    data:{labels:months,datasets:[{label:"Guests",data:perMonth,borderColor:colors[0],backgroundColor:"rgba(15,157,138,.2)",fill:true,tension:.3}]},
    options:Object.assign({},opts,{scales:{y:{beginAtZero:true}}})});
})();
