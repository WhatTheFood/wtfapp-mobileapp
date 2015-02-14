wtf.controller('loginctrl', ['$scope','$state', '$http', 'loginservice', function($scope, $state, $http, loginservice) {
    
    $scope.gohome = function(){
        $state.go('wtf.rulist');
	}
	
	$scope.fbLogin = function()  {
		loginservice.loginfb().then(function(user) {
			console.log("Token FB : "+user);
			if(user == "error") {
				alert("Erreur login");
			} else {
				$state.go("wtf.rulist");
			}
		}
	)}
}]);