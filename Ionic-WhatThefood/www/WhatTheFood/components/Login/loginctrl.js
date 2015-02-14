wtf.controller('loginctrl', ['$scope','$state', '$http', 'loginservice', function($scope, $state, $http, loginservice) {
    
    $scope.gohome = function(){
        $state.go('wtf.rulist');
	}
	
	$scope.fbLogin = function()  {
		loginservice.loginfb().then(function(user) {
			console.log("login fb");
			if(user.isString()) {
				alert("Erreur login");
			} else {
				$state.go("wtf.rulist");
			}
		}
	)}
}]);