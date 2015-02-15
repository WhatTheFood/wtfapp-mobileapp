wtf.controller('profilectrl', ['$scope','$state', '$http', 'loginservice', function($scope, $state, $http, loginservice) {
    
    $scope.gohome = function(){
        $state.go('wtf.rulist');
	}
}]);