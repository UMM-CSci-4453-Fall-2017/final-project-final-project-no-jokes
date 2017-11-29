angular.module('gameState',[])
  .controller('gameStateCtrl',GameStateCtrl)
  .factory('gameStateApi',gameStateApi)
  .constant('apiUrl','http://localhost:1337'); 

function GameStateCtrl($scope,registerApi){

   $scope.classEvents=[]; //Stores eventID for the corresponding
   $scope.freeEvents=[];  //Event in the database
   $scope.username="No one";
   $scope.password="N/A"
   //$scope.newCharacter=-1; //0 means they choose to login, 1 means they choose to make a new character
   $scope.characterInformation=characterInformation;
   $scope.characterInventory=characterInventory;
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
		   $scope.errorMessage="Unable to get events: Database request failed";
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

   getClassEvents();
   getFreeEvents();
}
function gameStateApi($http,apiUrl){
  	return{
    		getClassEvents: function(){
      			var url = apiUrl + '/classEvents';
      			return $http.get(url);
    		},
		getFreeEvents: function(){
        		var url = apiUrl + '/freeEvents';
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
		}


 };
}
