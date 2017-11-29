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
	var invID = req.param('invID');
        var quantity = req.param('quantity');
        var receiptNumber = req.param('receiptNumber');
        var user = req.param('user');
        var firstTime = req.param('firstTime');
        var lastTime = req.param('lastTime');
        var finalCost = req.param('finalCost');

	var sql = 'SELECT XaiMarsh.till_buttons.*, XaiMarsh.prices.prices FROM XaiMarsh.till_buttons LEFT JOIN (XaiMarsh.prices) on (XaiMarsh.till_buttons.invID = XaiMarsh.prices.id)';
	async.series([
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
});

app.get("/getCharInfo",function(req,res){
	var IDNumber = req.param('userID');
	var sql = 'SELECT XaiMarsh.fp_world_state.Firstname,XaiMarsh.fp_world_state.Lastname,XaiMarsh.fp_world_state.Dotw,XaiMarsh.fp_stats.FunFact,XaiMarsh.fp_stats.Intellect,XaiMarsh.fp_stats.CommitProficiency,XaiMarsh.fp_stats.CodeQuality,XaiMarsh.fp_stats.MaxFreeTime,XaiMarsh.fp_stats.GoogleProficiency,XaiMarsh.fp_grades.grade1,XaiMarsh.fp_grades.grade2,XaiMarsh.fp_grades.grade3,XaiMarsh.fp_grades.grade4 from XaiMarsh.fp_world_state LEFT JOIN XaiMarsh.fp_stats ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_stats.IDNumber LEFT JOIN XaiMarsh.fp_grades ON XaiMarsh.fp_world_state.IDNumber=XaiMarsh.fp_grades.IDNumber';
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
app.get("/getCharInventory",function(req,res){
        var IDNumber = req.param('userID');
        var sql ='SELECT XaiMarsh.fp_inventory.item, XaiMarsh.fp_inventory.quantity from XaiMarsh.inventory where XaiMarsh.inventory.IDNumber='+IDNumber+')'; 
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

app.get("/world_state",function(req,res){
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
                        connection.query(sql, (function(res){return function(err,rows,fields){
                                if(err){console.log("we have an error:");
                                        console.log(err);
                                        res.send(err)} else {
                                                callback();
                                        }
                        }})(res));
                }
        ]);
});









//-----------------------------------------------------------------------------------------------------------------------

app.listen(port);
