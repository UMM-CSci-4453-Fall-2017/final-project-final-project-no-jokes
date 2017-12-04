angular.module('gameState',[])
  .controller('gameStateCtrl',GameStateCtrl)
  .factory('gameStateApi',gameStateApi)
  .constant('apiUrl','http://localhost:1337'); 

function GameStateCtrl($scope,registerApi){

   $scope.classEvents=[]; //Stores eventID for the corresponding
   $scope.freeEvents=[];  //Event in the database
   $scope.chanceClassEvents=[];
   $scope.chanceFreeEvents=[];
   $scope.numberOfEvents=0;
   $scope.username="No one";
   $scope.password="N/A"
   //$scope.newCharacter=-1; //0 means they choose to login, 1 means they choose to make a new character
   $scope.characterInformation=characterInformation;
   //$scope.characterInventory=characterInventory;
   $scope.currentEvent=currentEvent;
   $scope.userID=-1;
   $scope.isLoggedIn=false;

   var loading = false;

   function isLoading(){
    	return loading;
   }

   function getClassEvents() {
	loading=true;
	$scope.errorMessage='';
	GameStateApi.getClassEvents()
	   .success(function(data) {
		   scope.classEvents=data;
		   loading=false;
	   })
	   .error(function() {
		   $scope.errorMessage="Unable to get classEvents: Database request failed";
		   loading=false;
	   });
   }

   function getChanceClassEvents() {
        loading=true;
        $scope.errorMessage='';
        GameStateApi.getChanceClassEvents()
           .success(function(data) {
                   scope.chanceClassEvents=data;
                   loading=false;
           })
           .error(function() {
                   $scope.errorMessage="Unable to get chanceClassEvents: Database request failed";
                   loading=false;
           });
   }

   function getCurrentClassEvent(){
        loading=true;
        $scope.errorMessage='';
        var eventID = getRandomInt(0, ClassEvents.length);
        GameStateApi.getCurrentClassEvent(eventID)
           .success(function(data) {
                   scope.currentEvent=data;
                   loading=false;
           })
           .error(function(){
                   $scope.errorMessage="Unable to get currentClassEvent: Database request failed";
                   loading=false;
           });
   }

   function getCurrentChanceFreeEvent(){
        loading=true;
        $scope.errorMessage='';
        var eventID = getRandomInt(0, chanceClassEvents.length);
        GameStateApi.getCurrentChanceClassEvent(eventID)
           .success(function(data) {
                   scope.currentEvent=data;
                   loading=false;
           })
           .error(function(){
                   $scope.errorMessage="Unable to get currentChanceClassEvent: Database request failed";
                   loading=false;
           });
   }


   function getFreeEvents() {
        loading=true;
        $scope.errorMessage='';
        GameStateApi.getFreeEvents()
           .success(function(data) {
                   scope.freeEvents=data;
                   loading=false;
           })
           .error(function() {
                   $scope.errorMessage="Unable to get events: Database request failed";
                   loading=false;
           });
   }

   function getChanceFreeEvents() {
        loading=true;
        $scope.errorMessage='';
        GameStateApi.getChanceFreeEvents()
           .success(function(data) {
                   scope.chanceFreeEvents=data;
                   loading=false;
           })
           .error(function() {
                   $scope.errorMessage="Unable to get chanceFreeEvents: Database request failed";
                   loading=false;
           });
   }

   function getCurrentFreeEvent(){
	loading=true;
	$scope.errorMessage='';
	var eventID = getRandomInt(0, chanceFreeEvents.length);
	GameStateApi.getCurrentChanceFreeEvent(eventID)
	   .success(function(data) {
		   scope.currentEvent=data;
		   loading=false;
	   })
	   .error(function(){
		   $scope.errorMessage="Unable to get currentFreeEvent: Database request failed";
		   loading=false;
	   });
   }

   function getCurrentChanceFreeEvent(){
        loading=true;
        $scope.errorMessage='';
        var eventID = getRandomInt(0, chanceFreeEvents.length);
        GameStateApi.getCurrentChanceFreeEvent(eventID)
           .success(function(data) {
                   scope.currentEvent=data;
                   loading=false;
           })
           .error(function(){
                   $scope.errorMessage="Unable to get currentChanceFreeEvent: Database request failed";
                   loading=false;
           });
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
	GameStateApi.getCharacterInformation(userID)
	   .success(function(data) {
		   scope.characterInformation=data;
		   loading=false;
	   })
	   .error(function() {
		   $scope.errorMessage="Unable to get character information: Database request failed";
		   loading=false;
	   });
   }

   function getCharacterInventory(userID) {
        loading=true;
        $scope.errorMessage='';
        GameStateApi.getCharacterInventory(userID)
           .success(function(data) {
                   scope.characterInventory=data;
                   loading=false;
           })
           .error(function() {
                   $scope.errorMessage="Unable to get character inventory: Database request failed";
                   loading=false;
           });
   }

   function login() {
	$scope.errorMessage='';
	loading = true;
	var loggedIn = false; 

	gameStateApi.login($scope.username, $scope.password)
	  .success(function(data){
		if(data.length == 1){
			$scope.userID=data.IDNumber;
			loggedIn = true;
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

	//Write helper function that does the scanning (pass in button1, button2 etc depending on $event)
   function selectEventChoice($event) {
	$scope.errorMessage='';
	loading = true;
	if ($event == 1) {
		resultContainsStat(result1);
		gameStateApi.getResultEvent($scope.choice1)
		.success(function(data){
			$scope.currentEvent=data;
			if(data.result1 == -1)
			{
				$scope.numberOfEvents++;
				getNewEvent($scope.numberOfEvents);
				loading = false;
			}
		}
		.error(function(){
			$scope.errorMessage="unable to get result event: Database request failed";
			loading = false;
		}
	}
	
	if ($event == 2) {
                resultContainsStat(result2);
                gameStateApi.getResultEvent($scope.choice2)
                .success(function(data){
                        $scope.currentEvent=data;
                        if(data.result1 == -1)
                        {
                                $scope.numberOfEvents++;
                                getNewEvent($scope.numberOfEvents);
                                loading = false;
                        }
                }
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                }
        }

	if ($event == 3) {
                resultContainsStat(result3);
                gameStateApi.getResultEvent($scope.choice3)
                .success(function(data){
                        $scope.currentEvent=data;
                        if(data.result1 == -1)
                        {
                                $scope.numberOfEvents++;
                                getNewEvent($scope.numberOfEvents);
                                loading = false;
                        }
                }
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                }
        }

	if ($event == 4) {
                resultContainsStat(result4);
                gameStateApi.getResultEvent($scope.choice4)
                .success(function(data){
                        $scope.currentEvent=data;
                        if(data.result1 == -1)
                        {
                                $scope.numberOfEvents++;
                                getNewEvent($scope.numberOfEvents);
                                loading = false;
                        }
                }
                .error(function(){
                        $scope.errorMessage="unable to get result event: Database request failed";
                        loading = false;
                }
        }	
   }
   
   //Checks the result string to see if it contains the name of one of the stats so it can increment it
   function resultContainsStat(string) {

   }

   function getNewEvents(eventCount) {
	   if(eventCount == 5) {
		//UpdateDatabase -> got into new day
	   }
	   if(eventCount == 2) {
		getCurrentChanceClassEvent();
	   }
	   else if (eventCount == 3) {
		getCurrentChanceFreeEvent();
	   }
	   else if(eventCount%2 == 0) {
		getCurrentClassEvent();
	   }
	   else if (eventCount%2 == 1) {
		getCurrentFreeEvent();
	   }
   }

   getClassEvents();
   getFreeEvents();
   getChanceClassEvents();
   getChanceFreeEvents();
   getNewEvent($scope.numberOfEvents);
}
function gameStateApi($http,apiUrl){
  	return{
    		getClassEvents: function(){
      			var url = apiUrl + '/classEvents';
      			return $http.get(url);
    		},
		getChanceClassEvents: function(){
			var url = apiUrl + '/chanceClassEvents';
			return $http.get(url);
		},
		getCurrentClassEvent: function(eventID){
                        var url = apiUrl + '/getCurrentClassEvent?eventID='+eventID;
			return $http.get(url);
                },
		getCurrentChanceClassEvent: function(eventID){
			var url = apiUrl + '/getCurrentChanceClassEvent?eventID='+eventID;
			return $http.get(url);
		},
		getFreeEvents: function(){
        		var url = apiUrl + '/freeEvents';
        		return $http.get(url);
    		},
		getChanceFreeEvents: function(){
                        var url = apiUrl + '/chanceFreeEvents';
                        return $http.get(url);
                },
		getCurrentFreeEvent: function(eventID){
			var url = apiUrl + '/getCurrentFreeEvent?eventID='+eventID;
			return $http.get(url);
		},
		getCurrentChanceFreeEvent: function(eventID){
                        var url = apiUrl + '/getCurrentChanceFreeEvent?eventID='+eventID;
			return $http.get(url);
                },
		getCharacterInformation: function(userID){
			var url = apiUrl + '/getCharInfo?userID='+userID;
			return $http.get(url);
		},
		getCharacterInventory: function(userID){
			var url = apiUrl + '/getCharInventory?userID='+userID;
			return $http.get(url);
		},
		login: function(username, password) {
			var url = apiUrl + '/login?username='+username+'&password='+password;
			return $http.get(url);
		},
		updateDatabase: function(userID, dayOfTheWeek, funFact, knowledge, commitProficiency, codeQuality, maxEnergy, googleProficiency,
		grade1, grade2, grade3, grade4) {
			var url = apiUrl + '/updateDatabase?userID='+userID+'&dayOfTheWeek='+dayOfTheWeek+'&funFact='+funFact+'&knowledge='+knowledge+
				'&commitProficiency='+commitProficiency+'&codeQuality='+codeQuality+'&maxEnergy='+maxEnergy+'&googleProficiency='+googleProficiency+
				'&grade1='+grade1+'&grade2='+grade2+'&grade3='+grade3+'&grade4='+grade4;
		}


 };
}
