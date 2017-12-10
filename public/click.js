angular.module('gameState',[])
  .controller('gameStateCtrl',GameStateCtrl)
  .factory('gameStateApi',gameStateApi)
  .constant('apiUrl','http://localhost:1337'); 

function GameStateCtrl($scope,gameStateApi){

   $scope.classEvents=[]; //Stores eventID for the corresponding
   $scope.freeEvents=[];  //Event in the database
//   $scope.chanceClassEvents=[];
//   $scope.chanceFreeEvents=[];
   $scope.currentClassEvent=1;
   $scope.numberOfEvents=0;
   $scope.currentDay=1;
   $scope.username;
   $scope.password;
   //$scope.newCharacter=-1; //0 means they choose to login, 1 means they choose to make a new character
   $scope.characterInformation;
   //$scope.characterInventory=characterInventory;
   $scope.currentEvent;
   $scope.userID=-1;
   $scope.isLoggedIn=false;
   $scope.funFact=0;
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
   $scope.allStats = [["fun fact", "fun-fact"], ["knowledge", "learn"], ["commit proficiency", "commit"], ["code quality"], ["max energy", "energy", "rest"], ["google proficiency", "google"], ["stress"], ["de-stress", "break"]];
   $scope.addNewUser = addNewUser;
   $scope.login=login;
   $scope.firstname="Xai";
   $scope.lastname="Yang";
   $scope.selectEventChoice=selectEventChoice;

   var loading = false;

   function isLoading(){
    	return loading;
   }

   function getClassEvents() {
	loading=true;
	$scope.errorMessage='';

	console.log("current class event number "+$scope.currentClassEvent);
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

	   console.log("current class event number in getccevent function "+$scope.currentClassEvent);

	eventID = $scope.currentClassEvent;
	$scope.currentClassEvent++;

        gameStateApi.getCurrentClassEvent(eventID)
           .success(function(data) {
		   console.log("success");
                   $scope.currentEvent=data;
		   getPrintVariables(data);
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
	var eventID = getRandomInt(1, $scope.freeEvents.length);
	   console.log("eventID from rand: " + eventID);
	gameStateApi.getCurrentFreeEvent(eventID)
	   .success(function(data) {
		   console.log("getCurrentFreeEvent success");
		   $scope.currentEvent=data;
		   	getPrintVariables(data);
		   loading=false;
	   })
	   .error(function(){
		   $scope.errorMessage="Unable to get currentFreeEvent: Database request failed";
		   loading=false;
	   });
   }

   function getPrintVariables(data) {
	console.log(data[0]);
	   $scope.eventText = data[0].eventText;
	$scope.choice1 = data[0].button1;
	$scope.choice2 = data[0].button2;
	$scope.choice3 = data[0].button3;
        $scope.choice4 = data[0].button4;
	$scope.result1 = data[0].result1;
	$scope.result2 = data[0].result2;
	$scope.result3 = data[0].result3;
	$scope.result4 = data[0].result4;
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
		   saveStats(data[0]);
		   getNewEvent($scope.currentDay, $scope.numberOfEvents);
		   loading=false;
	   })
	   .error(function() {
		   $scope.errorMessage="Unable to get character information: Database request failed";
		   loading=false;
	   });
   }

   function login(username, password) {
	$scope.errorMessage='';
	loading = true; 
	$scope.username=username;
	$scope.password=password;

	gameStateApi.login($scope.username, $scope.password)
	  .success(function(data){
		if(data.length == 1){
			$scope.userID=data[0].IDNumber;
			console.log("userIDee: "+$scope.userID);
			$scope.isLoggedIn = true;
			getCharacterInformation($scope.userID);
			console.log("login getEvent: " + $scope.currentDay + " fjdjl "+$scope.numberOfEvents);
	
			loading = false;
		}
	  })
	  .error(function(){
		$scope.errorMessage="invalid username or password: Database request failed";
		  loading = false;
	  });

	  if(!$scope.isloggedIn){
		$scope.personLoggedIn = "Please Log In";
	  }
   }


   function addNewUser(username, password, firstname, lastname){
	  $scope.errorMessage='';
	  loading = true;
	  $scope.firstname=firstname;
	  $scope.lastname=lastname;
	  $scope.username=username;
	  $scope.password=password;

	gameStateApi.checkName($scope.username)
          .success(function(data){
		console.log("before if: "+ data.length);
                if(data.length == 0){
			console.log("got in if");
			gameStateApi.addNewUser($scope.username, $scope.password)
				.success(function(data){
					console.log(data[0].IDNumber);
					$scope.userID = data[0].IDNumber;
					console.log($scope.userID);
					gameStateApi.newCharacter($scope.userID, $scope.firstname, $scope.lastname, 0)
					.success(function(data) {
						console.log("passed newCharacter");
						gameStateApi.getCharacterInformation($scope.userID)
						.success(function(data){
							saveStats(data[0]);
							loading=false;
						})
						.error(function(){
							$scope.errorMessage="error getting character information: Database request failed";
							console.log($scope.errorMessage);
							loading=false;
						});
						$scope.isLoggedIn = true;
						getNewEvent($scope.currentDay, $scope.numberOfEvents);
					})
					.error(function(){
						$scope.errorMessage="error creating new character: Database request failed";
						console.log($scope.errorMessage);
						loading=false;
					});
				})
				.error(function(){
					$scope.errorMessage="error loading users: Database request failed - couldn't add user";
					console.log($scope.errorMessage);
					loading=false;
				});
                }
          })
          .error(function(){

                $scope.errorMessage="error loading users: Database request failed - couldn't check username";
                  loading = false;
          });
  }


  function getIndexof(toSubstring, keyChar){
        for(i = 1; i < toSubstring.length; i++){
                if(toSubstring.substring(i-1,i) == (keyChar)){
                        return (i-1);
                }
        }
   }
  function getSuccessChanceEvent(fullEventText){
        var location = getIndexof(fullEventText, "@");

        $scope.eventText = fullEventText.substring(0,location);
	console.log("success " + $scope.eventText);
   }

   function getFailChanceEvent(fullEventText){
        var location = getIndexof(fullEventText, "@");

        $scope.eventText = fullEventText.substring(location+1, fullEventText.length);
	console.log("fail " + $scope.eventText);
   }

	//Write helper function that does the scanning (pass in button1, button2 etc depending on $event)
   function selectEventChoice($event) {
	console.log("it got in selectEChoice");
	$scope.errorMessage='';
	loading = true;
	if ($event.target.id == 1) {
		checkForIncreaseStat($scope.choice1);
		console.log($scope.result1);
		gameStateApi.getResultEvent($scope.result1)
		.success(function(data){
			$scope.currentEvent=data;
			getPrintVariables(data);
			if(data[0].result1 == -1)
			{
				//This where i do the stat thing?
				if(data[0].relevantStat > -1) {
					chanceRandomizer(data[0].relevantStat);
				}
				$scope.numberOfEvents++;
				alert($scope.eventText);
				getNewEvent($scope.currentDay, $scope.numberOfEvents);
				loading = false;
			}
		})
		.error(function(){
			$scope.errorMessage="unable to get result event: Database request failed";
			loading = false;
		});
	}
	
	if ($event.target.id == 2) {
                checkForIncreaseStat($scope.choice2);
                gameStateApi.getResultEvent($scope.result2)
                .success(function(data){
                        $scope.currentEvent=data;
			getPrintVariables(data);
                        if(data[0].result1 == -1)
                        {
				if(data[0].relevantStat > -1) {
                                        chanceRandomizer(data[0].relevantStat);
                                }
                                $scope.numberOfEvents++;
				alert($scope.eventText); //Is the new event goign to have the text in choice?
				getNewEvent($scope.currentDay, $scope.numberOfEvents);
                                loading = false;
                        }
                })
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                });
        }

	if ($event.target.id == 3) {
                checkForIncreaseStat($scope.choice3);
                gameStateApi.getResultEvent($scope.result3)
                .success(function(data){
                        $scope.currentEvent=data;
			getPrintVariables(data);
                        if(data[0].result1 == -1)
                        {
				if(data[0].relevantStat > -1) {
                                        chanceRandomizer(data[0].relevantStat);
                                }
                                $scope.numberOfEvents++;
				alert($scope.eventText);
 				getNewEvent($scope.currentDay, $scope.numberOfEvents);
                                loading = false;
                        }
                })
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                });
        }

	if ($event.target.id == 4) {
                checkForIncreaseStat($scope.choice4);
                gameStateApi.getResultEvent($scope.result4)
                .success(function(data){
                        $scope.currentEvent=data;
			getPrintVariables(data);
                        if(data[0].result1 == -1)
                        {
				if(data[0].relevantStat > -1) {
                                        chanceRandomizer(data[0].relevantStat);
                                }
                                $scope.numberOfEvents++;
				alert($scope.eventText);
                                getNewEvent($scope.currentDay, $scope.numberOfEvents);
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
	   console.log("idnumber is: "+$scope.userID);
		console.log("saveStats datapacket: " + datapacket);
		console.log("knowledge from datpacket: " + datapacket.Knowledge);
//	$scope.userID=datapacket.IDNumber;
	$scope.funFact=datapacket.FunFact;
	$scope.knowledge=datapacket.Knowledge;
	console.log("knowledge from scope: " + $scope.knowledge);
	$scope.commitProficiency=datapacket.CommitProficiency;
	$scope.codeQuality=datapacket.CodeQuality;
	$scope.maxEnergy=datapacket.MaxEnergy;
	$scope.googleProficiency=datapacket.GoogleProficiency;
	$scope.grade1=datapacket.grade1;
	$scope.grade2=datapacket.grade2;
	$scope.grade3=datapacket.grade3;
	$scope.grade4=datapacket.grade4;
	$scope.stress=datapacket.Stress;
	   console.log("Day of the week: "+datapacket.Dotw);
	$scope.currentDay=datapacket.Dotw;
	$scope.firstname=datapacket.Firstname;
	$scope.lastname=datapacket.Lastname;

	if ($scope.currentDay == 1) $scope.currentClassEvent = 1;
        if ($scope.currentDay == 2) $scope.currentClassEvent = 4;
        if ($scope.currentDay == 3) $scope.currentClassEvent = 6;
        if ($scope.currentDay == 4) $scope.currentClassEvent = 9;
        if ($scope.currentDay == 5) $scope.currentClassEvent = 11;
	loading = false;
   }

   function getNewEvent(dayCount, eventCount) {
	   console.log("it got into getNewEvent" + dayCount + "now eventCount:" + eventCount);
	   if(eventCount == 5 && dayCount < 5) {
		   console.log("its about to updateDatabase with stress = "+$scope.stress);
		   $scope.currentDay++;
		   //userID, dayOfTheWeek, funFact, knowledge, commitProficiency, codeQuality, maxEnergy, googleProficiency,grade1, grade2, grade3, grade4, stress
		   gameStateApi.updateDatabase($scope.userID, $scope.currentDay, $scope.funFact, $scope.knowledge, $scope.commitProficiency, $scope.codeQuality, $scope.maxEnergy, $scope.googleProficiency, $scope.grade1, $scope.grade2, $scope.grade3, $scope.grade4, $scope.stress) 
		   .success(function(data){
			$scope.numberOfEvents=0;
			alert("On to day " + $scope.currentDay);
			getNewEvent($scope.currentDay, $scope.numberOfEvents);
			   console.log("about to reset events to 0");
			   $scope.numberOfEvents=0;
			   loading=false;
		   })
		   .error(function(){
			$scope.errorMessage="unable to updateDatabase: Database request failed";
		   });
	   }
	   else if (dayCount > 4 && eventCount == 5) {
		getGrades();
	   }
	   else if(eventCount%2 == 0 && dayCount%2 == 1) {
		console.log("it got into the right place");
		getCurrentClassEvent();
		eventCount++;
	   }
	   else if(eventCount%2 == 0 && dayCount%2 == 0) {
                getCurrentFreeEvent();
		eventCount++;
           }
	   else if (eventCount%2 == 1 && dayCount%2 == 1) {
		console.log("it should be here now");
		getCurrentFreeEvent();
		eventCount++;
	   }
	   else if (eventCount%2 == 1 && dayCount%2 == 0) {
                getCurrentClassEvent();
		eventCount++;
           }
   }

   function searchStringForKeyword(keyword, bigstringSmallfont) {
	   var toReturn = bigstringSmallfont.includes(keyword);
	   return toReturn;
   }

   function increaseStat(toCompare) {
	if(toCompare == "fun fact") {
		$scope.funFact++;
	} else if (toCompare == "knowledge") {
		$scope.knowledge++;
	} else if (toCompare == "commit proficiency") {
                $scope.commitProficiency++;
        } else if (toCompare == "code quality") {
                $scope.codeQuality++;
        } else if (toCompare == "max energy") {
                $scope.maxEnergy++;
        } else if (toCompare == "google proficiency") {
                $scope.googleProficiency++;
        } else if (toCompare == "stress") {
                $scope.stress++;
        } else if (toCompare == "de-stress") {
		$scope.stress = $scope.stress - 2;
		if ($scope.stress < 0) {
			$scope.stress = 0;
		}
	}
   }

   function checkForIncreaseStat(toCheck) {
	var smallString = toCheck.toLowerCase();
	for (i = 0; i < $scope.allStats.length; i++) {
		for (j = 0; j < $scope.allStats[i].length; j++) {
			if (searchStringForKeyword($scope.allStats[i][j], smallString)) {
				increaseStat($scope.allStats[i][0]);
				break;
			}
		}
	}
   }

   function chanceRandomizer(relevantStat) {
	if (relevantStat == 0) {
		if((Math.random()*100 < (50))) {
                        //Choose first event - Xai has it set up as successString@failString
                        //Query database for event with some symbol meaning take success or fail?
                        getSuccessChanceEvent($scope.eventText);
                } else {
                        getFailChanceEvent($scope.eventText);
                }
	}
	else if(relevantStat == 1) {
		if((Math.random()*100 < (50+($scope.funFact*3)))) {
			//Choose first event - Xai has it set up as successString@failString
			//Query database for event with some symbol meaning take success or fail?
			getSuccessChanceEvent($scope.eventText);
		} else {
			getFailChanceEvent($scope.eventText);
		}
	}
	else if(relevantStat == 2) {
                if((Math.random()*100 < (50+($scope.knowledge*3)))) {
			getSuccessChanceEvent($scope.eventText);
                } else {
                	getFailChanceEvent($scope.eventText);
                }
        }
	else if(relevantStat == 3) {
                if((Math.random()*100 < (50+($scope.commitProficiency*3)))) {
			getSuccessChanceEvent($scope.eventText);
                } else {
                	getFailChanceEvent($scope.eventText);
                }
        }
	else if(relevantStat == 4) {
                if((Math.random()*100 < (50+($scope.codeQuality*3)))) {
			getSuccessChanceEvent($scope.eventText);
                } else {
                	getFailChanceEvent($scope.eventText);
                }
        }
	else if(relevantStat == 5) {
                if((Math.random()*100 < (50+($scope.maxEnergy*3)))) {
			getSuccessChanceEvent($scope.eventText);
                } else {
                	getFailChanceEvent($scope.eventText);
                }
        }
	else if(relevantStat == 6) {
                if((Math.random()*100 < (50+($scope.googleProficiency*3)))) {
			getSuccessChanceEvent($scope.eventText);
                } else {
                	getFailChanceEvent($scope.eventText);
                }
        }
	else if(relevantStat == 7) {
                if((Math.random()*100 < (100-($scope.stress*8)))) {
			getSuccessChanceEvent($scope.eventText);
                } else {
                	getFailChanceEvent($scope.eventText);
                }
        }
   }

   function getGrades() {
	$scope.grade1 = ($scope.grade1 + ((-7 + $scope.maxEnergy) * getRandomInt(1, 3)) - ($scope.stress * getRandomInt(1, 3)) + ((-10 + $scope.knowledge) * getRandomInt(2, 3))); //Algorithms
	$scope.grade2 = ($scope.grade2 + ((-13 + $scope.commitProficiency + $scope.googleProficiency) * getRandomInt(1, 3)) - ($scope.stress * getRandomInt(1, 3)) + ((-10 + $scope.knowledge) * getRandomInt(2, 3))); //Databases
	$scope.grade3 = ($scope.grade3 + ((-13 + $scope.funFact + $scope.commitProficiency) * getRandomInt(1, 3)) - ($scope.stress * getRandomInt(1, 3)) + ((-10 + $scope.knowledge) * getRandomInt(2, 3))); //Practicum
	$scope.grade4 = ($scope.grade4 + ((-7 + $scope.maxEnergy * getRandomInt(1, 3)) * getRandomInt(1, 3)) - ($scope.stress * getRandomInt(1, 3)) + ((-10 + $scope.knowledge) * getRandomInt(2, 3))); //Software Design
	alert("Your grade for Algorithms: " + $scope.grade1.toPrecision(3) +
		"\nYour grade for Databases: " + $scope.grade2.toPrecision(3) +
		"\nYour grade for Practicum: " + $scope.grade3.toPrecision(3) +
		"\nYour grade for Software Design: " + $scope.grade4.toPrecision(3));
   }

   getClassEvents();
   getFreeEvents(); 
//   getNewEvent($scope.currentDay, $scope.numberOfEvents);
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
		getResultEvent: function(eventID){
                        var url = apiUrl + '/getResultEvent?eventID='+eventID;
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
		checkName: function(username){
			var url = apiUrl + '/checkName?username='+username;
			return $http.get(url);
		},
		addNewUser: function(username, password){
			var url = apiUrl + '/addNewUser?username='+username+'&password='+password;
			return $http.get(url);
		},
		newCharacter: function(userID, firstname, lastname, overwrite){
			var url = apiUrl + '/newCharacter?IDNumber='+userID+'&Firstname='+firstname+'&Lastname='+lastname+'&Overwrite='+overwrite;
			return $http.get(url);
		},
		updateDatabase: function(userID, dayOfTheWeek, funFact, knowledge, commitProficiency, codeQuality, maxEnergy, googleProficiency,grade1, grade2, grade3, grade4, stress) {
			console.log("It's sending stress ="+stress);
			var url = apiUrl + '/updateDatabase?IDNumber='+userID+'&Dotw='+dayOfTheWeek+'&FunFact='+funFact+'&Knowledge='+knowledge+'&CommitProficiency='+commitProficiency+'&CodeQuality='+codeQuality+'&MaxEnergy='+maxEnergy+'&GoogleProficiency='+googleProficiency+'&grade1='+grade1+'&grade2='+grade2+'&grade3='+grade3+'&grade4='+grade4+'&Stress='+stress;
			return $http.get(url);
		}
 };
}
