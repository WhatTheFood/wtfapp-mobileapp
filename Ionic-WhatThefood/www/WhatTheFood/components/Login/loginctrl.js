wtf.controller('loginctrl', ['$scope','$state', function($scope, $state) {
    
    $scope.gohome = function(){
        $state.go('wtf.rulist');
    }
}]);