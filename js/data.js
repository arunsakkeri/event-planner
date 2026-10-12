// Static sample data for the Event Planner site (illustrative, not real bookings)
var SEED_EVENTS=[
 {id:1,name:"Spring Product Launch",type:"Corporate",date:"2026-03-12",venue:"Tampa Convention Center",guests:250,budget:18000,status:"Completed"},
 {id:2,name:"Johnson Wedding",type:"Wedding",date:"2026-04-25",venue:"Bayshore Garden Hall",guests:140,budget:32000,status:"Completed"},
 {id:3,name:"Annual Charity Gala",type:"Fundraiser",date:"2026-05-16",venue:"Straz Center",guests:320,budget:41000,status:"Completed"},
 {id:4,name:"Tech Meetup Night",type:"Community",date:"2026-06-09",venue:"Ybor Loft",guests:80,budget:3500,status:"Completed"},
 {id:5,name:"Patel Anniversary Dinner",type:"Social",date:"2026-07-18",venue:"Harbor View Restaurant",guests:45,budget:6200,status:"Completed"},
 {id:6,name:"Leadership Offsite",type:"Corporate",date:"2026-09-03",venue:"Clearwater Resort",guests:60,budget:14500,status:"Completed"},
 {id:7,name:"Fall Food Festival",type:"Community",date:"2026-10-24",venue:"Curtis Hixon Park",guests:900,budget:27000,status:"Confirmed"},
 {id:8,name:"Garcia Wedding",type:"Wedding",date:"2026-11-14",venue:"Oak Lawn Estate",guests:180,budget:38000,status:"Confirmed"},
 {id:9,name:"Holiday Client Party",type:"Corporate",date:"2026-12-10",venue:"Riverwalk Ballroom",guests:200,budget:21000,status:"Planned"}
];
var EVENT_TYPES=["Corporate","Wedding","Fundraiser","Community","Social"];
var STATUSES=["Planned","Confirmed","Completed","Cancelled"];
// budget split by category, used on the analytics page
var BUDGET_BREAKDOWN={"Venue":32,"Catering":28,"Entertainment":14,"Decor":11,"Staffing":9,"Marketing":6};
