angular.module('gameState',[])
  .controller('gameStateCtrl',GameStateCtrl)
  .factory('gameStateApi',gameStateApi)
  .constant('apiUrl','http://localhost:1337'); 

function GameStateCtrl($scope,gameStateApi){

   $scope.classEvents=[]; //Stores eventID for the corresponding
   $scope.freeEvents=[];  //Event in the database
//   $scope.chanceClassEvents=[];
//   $scope.chanceFreeEvents=[];
   $scope.currentClassEvent=0;
   $scope.numberOfEvents=0;
   $scope.currentWeek=0;
   $scope.username="No one";
   $scope.password="N/A"
   //$scope.newCharacter=-1; //0 means they choose to login, 1 means they choose to make a new character
   $scope.characterInformation;
   //$scope.characterInventory=characterInventory;
   $scope.currentEvent;
   $scope.userID=-1;
   $scope.isLoggedIn=false;
   $scope.funFact=hbfu;
   $scope.knowledge=0;
   $scope.commitProficiency=0;
   $scope.codeQuality=0;
   $scope.maxEnergy=0;
   $scope.googleProficiency=0;
   $scope.stress=0;
   $scope.grade1=0;
   $scope.grade2=0;
   $scope.grade3=0;
   $scope.grade4=0;
   $scope.eventText="";
   $scope.choice1="";
   $scope.choice2="";
   $scope.choice3="";
   $scope.choice4="";
   $scope.allStats = [["funfact"], ["knowledge"], ["commitproficiency"], ["codequality"], ["maxenergy"], ["googleproficiency"], ["stress"]];

   var loading = false;

   function isLoading(){
    	return loading;
   }

   function getClassEvents() {
	loading=true;
	$scope.errorMessage='';
	gameStateApi.getClassEvents()
	   .success(function(data) {
		   $scope.classEvents=data;
		   loading=false;
	   })
	   .error(function() {
		   $scope.errorMessage="Unable to get classEvents: Database request failed";
		   loading=false;
	   });
   }

   function getCurrentClassEvent(){
        loading=true;
        $scope.errorMessage='';
        var eventID = getRandomInt(0, classEvents.length);
        gameStateApi.getCurrentClassEvent(eventID)
           .success(function(data) {
                   $scope.currentEvent=data;
                   loading=false;
           })
           .error(function(){
                   $scope.errorMessage="Unable to get currentClassEvent: Database request failed";
                   loading=false;
           });
   }

   function getFreeEvents() {
        loading=true;
        $scope.errorMessage='';
        gameStateApi.getFreeEvents()
           .success(function(data) {
		   $scope.freeEvents=data;
                   loading=false;
           })
           .error(function() {
                   $scope.errorMessage="Unable to get events: Database request failed";
                   loading=false;
           });
   }

   function getCurrentFreeEvent(){
	loading=true;
	$scope.errorMessage='';
	var eventID = getRandomInt(0, $scope.freeEvents.length);
	gameStateApi.getCurrentFreeEvent(eventID)
	   .success(function(data) {
		   $scope.currentEvent=data;
		   loading=false;
	   })
	   .error(function(){
		   $scope.errorMessage="Unable to get currentFreeEvent: Database request failed";
		   loading=false;
	   });
   }

   function getPrintVariables(data) {
	$scope.eventText = data.eventText;
	$scope.choice1 = data.button1;
	$scope.choice2 = data.button2;
	$scope.choice3 = data.button3;
        $scope.choice4 = data.button4;   
   }

   //Thanks internet
   function getRandomInt(min, max) {
 	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

   function getCharacterInformation(userID) {
	loading=true;
	$scope.errorMessage='';
	gameStateApi.getCharacterInformation(userID)
	   .success(function(data) {
		   saveStats(data);
		   loading=false;
	   })
	   .error(function() {
		   $scope.errorMessage="Unable to get character information: Database request failed";
		   loading=false;
	   });
   }

   function login() {
	$scope.errorMessage='';
	loading = true; 

	gameStateApi.login($scope.username, $scope.password)
	  .success(function(data){
		if(data.length == 1){
			$scope.userID=data.IDNumber;
			$scope.isLoggedIn = true;
			getCharacterInformation($scope.userID);
			loading = false;
		}
	  })
	  .error(function(){
		$scope.errorMessage="invalid username or password: Database request failed";
		  loading = false;
	  });

	  if(!isloggedIn){
		$scope.personLoggedIn = "Please Log In";
	  }
   }

   function addNewUser(){
	  $scope.errorMessage='';
	  loading = true;

	gameStateApi.checkName($scope.username)
          .success(function(data){
                if(data.length == 0){
			gameStateApi.addNewUser($scope.username, $scope.password)
				.success(function(data){
					$scope.userID = data.IDNumber;
					gameStateApi.newCharacter($scope.userID, $scope.firstname, $scope.lastname, 0)
					.success(function() {
						gameStateApi.getCharacterInformation($scope.userID)
						$scope.isLoggedIn = true;
					}
					loading = false;
				})
				.error(function(){
					$scope.errorMessage="error loading users: Database request failed - couldn't add user";
					loading=false;
				});
                }
          })
          .error(function(){

                $scope.errorMessage="error loading users: Database request failed - couldn't check username";
                  loading = false;
          });
  }

	//Write helper function that does the scanning (pass in button1, button2 etc depending on $event)
   function selectEventChoice($event) {
	$scope.errorMessage='';
	loading = true;
	if ($event == 1) {
		resultContainsStat(result1);
		gameStateApi.getResultEvent($scope.choice1)
		.success(function(data){
			$scope.currentEvent=data;
			getPrintVariables(data);
			if(data.result1 == -1)
			{
				//This where i do the stat thing?
				if(relaventStat > 0) {
					chanceRandomizer(relaventStat);
				}
				$scope.numberOfEvents++;
				alert(data.choice1);
				getNewEvent($scope.currentWeek, $scope.numberOfEvents);
				loading = false;
			}
		})
		.error(function(){
			$scope.errorMessage="unable to get result event: Database request failed";
			loading = false;
		});
	}
	
	if ($event == 2) {
                resultContainsStat(result2);
                gameStateApi.getResultEvent($scope.choice2)
                .success(function(data){
                        $scope.currentEvent=data;
			getPrintVariables(data);
                        if(data.result1 == -1)
                        {
                                $scope.numberOfEvents++;
				alert(data.choice1); //Is the new event goign to have the text in choice?
				getNewEvent($scope.currentWeek, $scope.numberOfEvents);
                                loading = false;
                        }
                })
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                });
        }

	if ($event == 3) {
                resultContainsStat(result3);
                gameStateApi.getResultEvent($scope.choice3)
                .success(function(data){
                        $scope.currentEvent=data;
			getPrintVariables(data);
                        if(data.result1 == -1)
                        {
                                $scope.numberOfEvents++;
				alert(data.choice1);
 				getNewEvent($scope.currentWeek, $scope.numberOfEvents);
                                loading = false;
                        }
                })
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                });
        }

	if ($event == 4) {
                resultContainsStat(result4);
                gameStateApi.getResultEvent($scope.choice4)
                .success(function(data){
                        $scope.currentEvent=data;
			getPrintVariables(data);
                        if(data.result1 == -1)
                        {
                                $scope.numberOfEvents++;
				alert(data.choice1);
                                getNewEvent($scope.currentWeek, $scope.numberOfEvents);
                                loading = false;
                        }
                })
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                });
        }	
   }
   
   //Checks the result string to see if it contains the name of one of the stats so it can increment it
   //function resultContainsStat(string) {
//
   //}

   function saveStats(datapacket) {
	$scope.userID=datapacket.IDNumber;
	$scope.funFact=datapacket.FunFact;
	$scope.knowledge=datapacket.Knowledge;
	$scope.commitProficiency=datapacket.CommitProficiency;
	$scope.codeQuality=datapacket.CodeQuality;
	$scope.maxEnergy=datapacket.MaxEnergy;
	$scope.googleProficiency=datapacket.GoogleProficiency;
	$scope.grade1=datapacket.grade1;
	$scope.grade2=datapacket.grade2;
	$scope.grade3=datapacket.grade3;
	$scope.grade4=datapacket.grade4;
	$scope.stress=datapacket.Stress;
   }

   function getNewEvent(weeksCount, eventCount) {
	   if(eventCount == 5) {
		   gameStateApi.updateDatabase($scope.userID, $scope.funFact, $scope.knowledge, $scope.commitProficiency, $scope.codeQuality,
		   $scope.maxEnergy, $scope.googleProficiency, $scope.grade1, $scope.grade2, $scope.grade3, $scope.grade4, $scope.stress) //Insert alot of stuff
		   .success(function(data){
			   if(currentWeek == 5) {
				getGrades();
			   } else {
				$scope.currentWeek++;
			   }
			   $scope.numberOfEvents=0;
			   loading=false;
		   })
		   .error(function(){
			$scope.errorMessage="unable to updateDatabase: Database request failed";
		   });
	   }
	   else if(eventCount%2 == 0 && weeksCount%2 == 1) {
		getCurrentClassEvent();
	   }
	   else if(eventCount%2 == 0 && weeksCount%2 == 0) {
                getCurrentFreeEvent();
           }
	   else if (eventCount%2 == 1 && weeksCount%2 == 1) {
		getCurrentFreeEvent();
	   }
	   else if (eventCount%2 == 1 && weeksCount%2 == 0) {
                getCurrentClassEvent();
           }
   }

   function searchStringForKeyword(keyword, bigstringSmallfont) {
	   var toReturn = bigstringSmallfont.includes(keyword);
	   return toReturn;
   }

   function checkForIncreaseStat(toCheck) {
	var smallString = toCheck.lowerCase();
	for (i = 0; i < $scope.allStats.length; i++) {
		for (j = 0; j < $scope.allStats[i].length; j++) {
			if (searchStringForKeyword($scope.allStats[i][j], smallString)) {
				$scope.allStats[i][0]++;
				break;
			}
		}
	}
   }

   function chanceRandomizer(relevantStat) {
	if(relevantStat == 1) {
		if((Math.random()*100 > (50+($scope.funFact*3)))) {
			//Choose first event - Xai has it set up as successString@failString
			//Query database for event with some symbol meaning take success or fail?

		} else {
			
		}
	}
	else if(relevantStat == 2) {
                if((Math.random()*100 > (50+($scope.knowledge*3)))) {

                } else {
                
                }
        }
	else if(relevantStat == 3) {
                if((Math.random()*100 > (50+($scope.commitProficiency*3)))) {

                } else {
                
                }
        }
	else if(relevantStat == 4) {
                if((Math.random()*100 > (50+($scope.codeQuality*3)))) {

                } else {
                
                }
        }
	else if(relevantStat == 5) {
                if((Math.random()*100 > (50+($scope.maxEnergy*3)))) {

                } else {
                
                }
        }
	else if(relevantStat == 6) {
                if((Math.random()*100 > (50+($scope.googleProficiency*3)))) {

                } else {
                
                }
        }
	else if(relevantStat == 7) {
                if((Math.random()*100 > (100-($scope.stress*8)))) {

                } else {
                
                }
        }
   }

   function getEndGrades() {
	$scope.grade1 = ($scope.grade1 - (sress * 3)); //Algorithms
	$scope.grade2 = ($scope.grade2 - (sress * 3)); //Databases
	$scope.grade3 = ($scope.grade3 - (sress * 3)); //Practicum
	$scope.grade4 = ($scope.grade4 - (sress * 3)); //Software Design
	alert("Your grade for Algorithms: " + grade1.toPrecision(3) +
		"\nYour grade for Databases: " + grade2.toPrecision(3) +
		"\nYour grade for Practicum: " + grade3.toPrecision(3) +
		"\nYour grade for Software Design: " + grade4.toPrecision(3));
   }

   getClassEvents();
   getFreeEvents(); 
   getNewEvent($scope.currentWeek, $scope.numberOfEvents);
   //getStatsPacket();
   hbfu();
}
function gameStateApi($http,apiUrl){
  	return{
    		getClassEvents: function(){
      			var url = apiUrl + '/classEvents';
      			return $http.get(url);
    		},
		getCurrentClassEvent: function(eventID){
                        var url = apiUrl + '/getCurrentClassEvent?eventID='+eventID;
			return $http.get(url);
                },
		getFreeEvents: function(){
        		var url = apiUrl + '/freeEvents';
        		return $http.get(url);
    		},
		getCurrentFreeEvent: function(eventID){
			var url = apiUrl + '/getCurrentFreeEvent?eventID='+eventID;
			return $http.get(url);
		},
		getCharacterInformation: function(userID){
			var url = apiUrl + '/getCharInfo?userID='+userID;
			return $http.get(url);
		},
		login: function(username, password) {
			var url = apiUrl + '/login?username='+username+'&password='+password;
			return $http.get(url);
		},
		updateDatabase: function(userID, dayOfTheWeek, funFact, knowledge, commitProficiency, codeQuality, maxEnergy, googleProficiency,
		grade1, grade2, grade3, grade4, stress) {
			var url = apiUrl + '/updateDatabase?userID='+userID+'&dayOfTheWeek='+dayOfTheWeek+'&funFact='+funFact+'&knowledge='+knowledge+
				'&commitProficiency='+commitProficiency+'&codeQuality='+codeQuality+'&maxEnergy='+maxEnergy+'&googleProficiency='+googleProficiency+
				'&grade1='+grade1+'&grade2='+grade2+'&grade3='+grade3+'&grade4='+grade4+'&stress='+stress;
		}
 };
}
