async = require("async");

var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT XaiMarsh.till_buttons.*, XaiMarsh.prices.prices FROM XaiMarsh.till_buttons LEFT JOIN (XaiMarsh.prices) on (XaiMarsh.till_buttons.invID = XaiMarsh.prices.id)';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

// Your other API handlers go here!
app.get("/update",function(req,res){
	var invID = req.param('invID');
	var quantity = req.param('quantity');
	var receiptNumber = req.param('receiptNumber');
	var user = req.param('user');
	var firstTime = req.param('firstTime');
	var lastTime = req.param('lastTime');
	var finalCost = req.param('finalCost');
	var sql = 'insert into XaiMarsh.till_sales values('+receiptNumber+', '+invID+', '+quantity+', '+firstTime+', '+lastTime+')';
	var newQuantity = 0;
	if(invID != -1){
	async.series([
		function(callback){
			connection.query(sql, function(err,row,fields){
				if(err){console.log("We have an error:");
					console.log(err);}
				callback();
			});
		},
		function(callback){
			sql = 'select amount from XaiMarsh.till_inventory where id='+invID;
			connection.query(sql, function(err,row,fields){
				if (err) {console.log("We have an error:");
					console.log(err);}	
				newQuantity = row[0].amount - quantity;
				callback();
			});

		},
		function(callback){
			sql = 'update XaiMarsh.till_inventory set amount='+newQuantity+' where id='+invID;
			connection.query(sql, (function(res){return function(err,rows,fields){
				if(err){console.log("We have an error:");
					console.log(err);}
				res.send(err);
				callback();
			}})(res));
		}
	]);
	} else {
		async.series([
                function(callback){
			sql = 'insert into XaiMarsh.user_sales values('+receiptNumber+', "'+user+'",'+firstTime+', '+lastTime+', '+finalCost+')';
                        connection.query(sql, (function(res){return function(err,rows,fields){
                                if(err){console.log("We have an error:");
                                        console.log(err);}
                                res.send(err);
                                callback();
                        }})(res));
                }
        ]);

	}
});

//----------------------------------------------------------------------------------------------------------------------

app.get("/newCharacter",function(req,res){

	var IDNumber = req.param('IDNumber');
	var Firstname = req.param('Firstname');
	var Lastname = req.param('Lastname');
	var Overwrite = req.param('Overwrite');
	var sql;
	async.series([
	        function(callback){

			if(Overwrite == 0){
				sql = 'insert into XaiMarsh.fp_world_state values ('+IDNumber+', "'+Firstname+'", "'+Lastname+'", 0)';
			} else {
				sql = 'update XaiMarsh.fp_world_state set Firstname = "'+Firstname+'", Lastname = "'+Lastname+'", Dotw = 0 where IDNumber = '+IDNumber;
			}
        	        connection.query(sql, function(err,row,fields){
                	        if(err){console.log("We have an error:");
                        	        console.log(err);}
	                                callback();
                        });
                },
		function(callback){
			if(Overwrite == 0){
				sql = 'insert into XaiMarsh.fp_stats values ('+IDNumber+', 10, 10, 10, 10, 10, 10, 0)';
			} else {
				sql = 'update XaiMarsh.fp_stats set FunFact = 10, Knowledge = 10, CommitProficiency = 10, CodeQuality = 10, MaxEnergy = 10, GoogleProficiency = 10, Stress=0 where IDNumber = '+IDNumber;
			}
                        connection.query(sql, function(err,row,fields){
                                if(err){console.log("We have an error:");
                                        console.log(err);}
                                callback();
                        });
                },
                function(callback){
	                if(Overwrite == 0){
				sql = 'insert into XaiMarsh.fp_grades values ('+IDNumber+', 75, 75, 75, 75)';
			} else {
				sql = 'update XaiMarsh.fp_grades set grade1 = 75, grade2 = 75, grade3 = 75, grade4 = 75 where IDNumber = '+IDNumber;
			}
                        connection.query(sql, (function(res){return function(err,rows,fields){
                                        if(err){console.log("We have an error:");
                                                console.log(err);}
                                    res.send(err);
                                        callback();
                                }})(res));
                       }
	]);
});

app.get("/getCharInfo",function(req,res){
	var IDNumber = req.param('userID');
	var sql = 'SELECT XaiMarsh.fp_world_state.Firstname,XaiMarsh.fp_world_state.Lastname,XaiMarsh.fp_world_state.Dotw,XaiMarsh.fp_stats.FunFact,XaiMarsh.fp_stats.Knowledge,XaiMarsh.fp_stats.CommitProficiency,XaiMarsh.fp_stats.CodeQuality,XaiMarsh.fp_stats.MaxEnergy,XaiMarsh.fp_stats.GoogleProficiency,fp_stats.Stress, XaiMarsh.fp_grades.grade1,XaiMarsh.fp_grades.grade2,XaiMarsh.fp_grades.grade3,XaiMarsh.fp_grades.grade4 from XaiMarsh.fp_world_state LEFT JOIN XaiMarsh.fp_stats ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_stats.IDNumber LEFT JOIN XaiMarsh.fp_grades ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_grades.IDNumber';

	async.series([   
                function(callback){ 
                        connection.query(sql, (function(res){return function(err,rows,fields){ 
                                if(err){console.log("We have an error:");
                                        console.log(err);}
                           	res.send(rows);
                        	callback();
                        }})(res));
                }
       ]);
});
//app.get("/getCharInventory",function(req,res){
//        var IDNumber = req.param('userID');
//        var sql ='SELECT XaiMarsh.fp_inventory.item, XaiMarsh.fp_inventory.quantity from XaiMarsh.inventory where XaiMarsh.inventory.IDNumber='+IDNumber+')'; 
//        async.series([ 
//                function(callback){ 
//                        connection.query(sql, (function(res){return function(err,rows,fields){
//                                        if(err){console.log("We have an error:");
//                                                console.log(err);}
//                                        res.send(rows);
//                                        callback();
//                                }})(res));
//                       }
//                ]);
//});

app.get("/world_state",function(req,res){
        var user = req.param('user');
        var sql = 'insert into XaiMarsh.till_sales values('+receiptNumber+', '+invID+', '+quantity+', '+firstTime+', '+lastTime+')';
        var newQuantity = 0;
        if(invID != -1){
        	async.series([
                	function(callback){
                        	connection.query(sql, function(err,row,fields){
                                	if(err){console.log("We have an error:");
                                        	console.log(err);}
                	                callback();
                        	});
                	},
		
			function(callback){
        	                connection.query(sql, function(err,row,fields){
                	                if(err){console.log("We have an error:");
                        	                console.log(err);}
                                	callback();
	                        });
        	        },
                	function(callback){
                        	sql = 'update XaiMarsh.till_inventory set amount='+newQuantity+' where id='+invID;
                        	connection.query(sql, (function(res){return function(err,rows,fields){
                                	if(err){console.log("We have an error:");
                                        	console.log(err);}
    	                            res.send(err);
        	                        callback();
                	        }})(res));
         	       }
        	]);
        } else {
                async.series([
                	function(callback){
                        	sql = 'insert into XaiMarsh.user_sales values('+receiptNumber+', "'+user+'",'+firstTime+', '+lastTime+', '+finalCost+')';
                        	connection.query(sql, (function(res){return function(err,rows,fields){
                                	if(err){console.log("We have an error:");
                                        	console.log(err);}
                                	res.send(err);
                                	callback();
                        	}})(res));
                	}
        	]);

        }
});

app.get("/classEvents",function(req,res){
  var sql = 'SELECT eventID,classID FROM XaiMarsh.fp_class_events';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

app.get("/freeEvents",function(req,res){
  var sql = 'SELECT eventID FROM XaiMarsh.fp_free_events';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

app.get("/chanceClassEvents",function(req,res){
  var sql = 'SELECT eventID,classID FROM XaiMarsh.fp_chance_class_events';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

app.get("/chanceFreeEvents",function(req,res){
  var sql = 'SELECT eventID FROM XaiMarsh.fp_chance_free_events';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});


app.get("/login", function(req, res) {
        var username = req.param('username');
        var password = req.param('password');
        var sql = 'select IDNumber from XaiMarsh.fp_users where username="'+username+'" and password="'+password+'"';

        async.series([
                function(callback) {
                        connection.query(sql,(function(res){return function(err, rows, fields) {
                                if(err){console.log("We have an error:");
                                        console.log(err);
                                        res.send(err)}
                                else{
                                res.send(rows);
                                callback();
                                }
                        }})(res));
                }
        ]);
});

app.get("/checkName", function(req, res) {
        var username = req.param('username');
        var sql = 'select IDNumber from XaiMarsh.fp_users where username="'+username+'"';

async.series([
                function(callback) {
                        connection.query(sql,(function(res){return function(err, rows, fields) {
                                if(err){console.log("We have an error:");
                                        console.log(err);
                                       res.send(err)}
                                else{
                                res.send(rows);
                                callback();
                                }
                        }})(res));
                }
        ]);
});

app.get("/addNewUser", function(req, res) {
        var username = req.param('username');
        var password = req.param('password');
        var sql = 'insert into XaiMarsh.fp_users values("'+username+'", "'+password+'",'+'0)';

        async.series([
 		function(callback){
                                connection.query(sql, function(err,row,fields){
                                        if(err){console.log("We have an error:");
                                                console.log(err);}
                                        callback();
                                });
                },
		function(callback){
			sql = 'select IDNumber from XaiMarsh.fp_users where username="'+username+'" and password="'+password+'"';
			connection.query(sql,(function(res){return function(err, rows, fields) {
                                if(err){console.log("We have an error:");
                                        console.log(err);
                                       res.send(err)}
                                else{
                                res.send(rows);
                                callback();
                                }
                        }})(res));
                }
        ]);
});

app.get("/getCurrentFreeEvent",function(req,res){
	var eventID = req.param('eventID');
	var sql = 'SELECT * FROM XaiMarsh.fp_free_events where eventID='+eventID;
     	connection.query(sql,(function(res){return function(err,rows,fields){
     	if(err){console.log("We have an error:");
        	console.log(err);}
     	res.send(rows);
	}})(res));
});

app.get("/getCurrentClassEvent",function(req,res){
        var eventID = req.param('eventID');
        var sql = 'SELECT * FROM XaiMarsh.fp_class_events where eventID='+eventID;
        connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
                console.log(err);}
        res.send(rows);
        }})(res));
});

app.get("/getCurrentChanceFreeEvent",function(req,res){
        var eventID = req.param('eventID');
        var sql = 'SELECT * FROM XaiMarsh.fp_chance_free_events where eventID='+eventID;
        connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
                console.log(err);}
        res.send(rows);
        }})(res));
});

app.get("/getCurrentChanceClassEvent",function(req,res){
        var eventID = req.param('eventID');
        var sql = 'SELECT * FROM XaiMarsh.fp_chance_class_events where eventID='+eventID;
        connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
                console.log(err);}
        res.send(rows);
        }})(res));
});

app.get("/getResultEvent",function(req,res){
        var eventID = req.param('eventID');
        var sql = 'SELECT * FROM XaiMarsh.fp_result_events where eventID='+eventID;
        connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
                console.log(err);}
        res.send(rows);
        }})(res));
});

app.get("/updateDatabase",function(req,res){
        var IDNumber = req.param('IDNumber');
	
	//world_state
	var Dotw = req.param('Dotw');

	//stats
	var FunFact = req.param('FunFact');
	var Knowledge = req.param('Knowledge');
	var CommitProficiency = req.param('CommitProficiency');
	var CodeQuality = req.param('CodeQuality');
	var MaxEnergy = req.param('MaxEnergy');
	var GoogleProficiency = req.param('GoogleProficiency');

	//grades
	var grade1 = req.param('grade1');
	var grade2 = req.param('grade2');
	var grade3 = req.param('grade3');
	var grade4 = req.param('grade4');
   
       // var sql = 'SELECT XaiMarsh.fp_world_state.Firstname,XaiMarsh.fp_world_state.Lastname,XaiMarsh.fp_world_state.Dotw,XaiMarsh.fp_stats.FunFact,XaiMarsh.fp_stats.Knowledge,XaiMarsh.fp_stats.CommitProficiency,XaiMarsh.fp_stats.CodeQuality,XaiMarsh.fp_stats.MaxEnergy,XaiMarsh.fp_stats.GoogleProficiency,XaiMarsh.fp_grades.grade1,XaiMarsh.fp_grades.grade2,XaiMarsh.fp_grades.grade3,XaiMarsh.fp_grades.grade4 from XaiMarsh.fp_world_state LEFT JOIN XaiMarsh.fp_stats ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_stats.IDNumber LEFT JOIN XaiMarsh.fp_grades ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_grades.IDNumber';

	var sql = 'update XaiMarsh.world_state set Dotw = '+Dotw+' where XaiMarsh.world_state.IDNumber = '+IDNumber;
	async.series([
                function(callback){
                        connection.query(sql, function(err,row,fields){
                                if(err){console.log("We have an error:");
                                        console.log(err);}
                                        callback();
                        });
                },
		function(callback){
			sql = 'update XaiMarsh.stats set FunFact = '+FunFact+', Knowledge = '+Knowledge+', CommitProficiency = '+CommitProficiency+', CodeQuality = '+CodeQuality+', MaxEnergy = '+MaxEnergy+', GoogleProficiency = '+GoogleProficiency+' where IDNumber = '+IDNumber;
                        connection.query(sql, function(err,row,fields){
                                if(err){console.log("We have an error:");
                                        console.log(err);}
                                        callback();
                        });
                },
                function(callback){
                        sql = 'update XaiMarsh.grades set grade1 = '+grade1+', grade2 = '+grade2+', grade3 = '+grade3+', grade4 = '+grade4+' where IDNumber='+IDNumber;
                        connection.query(sql, (function(res){return function(err,rows,fields){
                                        if(err){console.log("We have an error:");
                                                console.log(err);}
                                    res.send(err);
                                        callback();
                                }})(res));
                       }
        ]);


});






//-----------------------------------------------------------------------------------------------------------------------

app.listen(port);
