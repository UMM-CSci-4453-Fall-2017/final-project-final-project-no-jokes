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

//----------------------------------------------------------------------------------------------------------------------
//update database with a new character for a new user
app.get("/newCharacter",function(req,res){

	var IDNumber = req.param('IDNumber');
	var Firstname = req.param('Firstname');
	var Lastname = req.param('Lastname');
	var Overwrite = req.param('Overwrite');
	var sql;
	async.series([
	        function(callback){

			if(Overwrite == 0){
				sql = 'insert into XaiMarsh.fp_world_state values ('+IDNumber+', "'+Firstname+'", "'+Lastname+'", 1)';
			} else {
				sql = 'update XaiMarsh.fp_world_state set Firstname = "'+Firstname+'", Lastname = "'+Lastname+'", Dotw = 1 where IDNumber = '+IDNumber;
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

//queries the database for character information that matches a given ID number
app.get("/getCharInfo",function(req,res){
	var IDNumber = req.param('userID');
	var sql = 'SELECT XaiMarsh.fp_world_state.Firstname,XaiMarsh.fp_world_state.Lastname,XaiMarsh.fp_world_state.Dotw,XaiMarsh.fp_stats.FunFact,XaiMarsh.fp_stats.Knowledge,XaiMarsh.fp_stats.CommitProficiency,XaiMarsh.fp_stats.CodeQuality,XaiMarsh.fp_stats.MaxEnergy,XaiMarsh.fp_stats.GoogleProficiency,fp_stats.Stress, XaiMarsh.fp_grades.grade1,XaiMarsh.fp_grades.grade2,XaiMarsh.fp_grades.grade3,XaiMarsh.fp_grades.grade4 from XaiMarsh.fp_world_state LEFT JOIN XaiMarsh.fp_stats ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_stats.IDNumber LEFT JOIN XaiMarsh.fp_grades ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_grades.IDNumber where XaiMarsh.fp_world_state.IDNumber = '+IDNumber;

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

//gets all the ID numbers for class events
app.get("/classEvents",function(req,res){
  var sql = 'SELECT eventID FROM XaiMarsh.fp_class_events';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

//gets all the ID numbers for free events
app.get("/freeEvents",function(req,res){
  var sql = 'SELECT eventID FROM XaiMarsh.fp_free_events';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

//logs in a user if there's a matching username and password
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

//checks if a username is available
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

//adds a new user's information and assigns an ID number
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

//gets free event information
app.get("/getCurrentFreeEvent",function(req,res){
	var eventID = req.param('eventID');
	var sql = 'SELECT * FROM XaiMarsh.fp_free_events where eventID='+eventID;
     	connection.query(sql,(function(res){return function(err,rows,fields){
     	if(err){console.log("We have an error:");
        	console.log(err);}
     	res.send(rows);
	}})(res));
});

//gets class event information
app.get("/getCurrentClassEvent",function(req,res){
        var eventID = req.param('eventID');
        var sql = 'SELECT * FROM XaiMarsh.fp_class_events where eventID='+eventID;
        connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
                console.log(err);}
        res.send(rows);
        }})(res));
});

//gets result event information
app.get("/getResultEvent",function(req,res){
        var eventID = req.param('eventID');
        var sql = 'SELECT * FROM XaiMarsh.fp_result_events where eventID='+eventID;
        connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
                console.log(err);}
        res.send(rows);
        }})(res));
});

//updates the database with new user information after an in game day
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
	var Stress = req.param('Stress');

	//grades
	var grade1 = req.param('grade1');
	var grade2 = req.param('grade2');
	var grade3 = req.param('grade3');
	var grade4 = req.param('grade4');
   
       // var sql = 'SELECT XaiMarsh.fp_world_state.Firstname,XaiMarsh.fp_world_state.Lastname,XaiMarsh.fp_world_state.Dotw,XaiMarsh.fp_stats.FunFact,XaiMarsh.fp_stats.Knowledge,XaiMarsh.fp_stats.CommitProficiency,XaiMarsh.fp_stats.CodeQuality,XaiMarsh.fp_stats.MaxEnergy,XaiMarsh.fp_stats.GoogleProficiency,XaiMarsh.fp_grades.grade1,XaiMarsh.fp_grades.grade2,XaiMarsh.fp_grades.grade3,XaiMarsh.fp_grades.grade4 from XaiMarsh.fp_world_state LEFT JOIN XaiMarsh.fp_stats ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_stats.IDNumber LEFT JOIN XaiMarsh.fp_grades ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_grades.IDNumber';

	var sql = 'update XaiMarsh.fp_world_state set Dotw = '+Dotw+' where XaiMarsh.fp_world_state.IDNumber = '+IDNumber;
	async.series([
                function(callback){
                        connection.query(sql, function(err,row,fields){
                                if(err){console.log("We have an error:");
                                        console.log(err);}
                                        callback();
                        });
                },
		function(callback){
			sql = 'update XaiMarsh.fp_stats set FunFact = '+FunFact+', Knowledge = '+Knowledge+', CommitProficiency = '+CommitProficiency+', CodeQuality = '+CodeQuality+', MaxEnergy = '+MaxEnergy+', GoogleProficiency = '+GoogleProficiency+', Stress = '+Stress+' where IDNumber = '+IDNumber;
                        connection.query(sql, function(err,row,fields){
                                if(err){console.log("We have an error:");
                                        console.log(err);}
                                        callback();
                        });
                },
                function(callback){
                        sql = 'update XaiMarsh.fp_grades set grade1 = '+grade1+', grade2 = '+grade2+', grade3 = '+grade3+', grade4 = '+grade4+' where IDNumber='+IDNumber;
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
