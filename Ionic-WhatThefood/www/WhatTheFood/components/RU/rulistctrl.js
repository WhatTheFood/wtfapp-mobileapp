/**
 * Created by Rony on 14/02/2015.
 */


wtf.controller('rulistctrl', ['$scope', 'rulistservice', function($scope, rulistservice) {

    $scope.data = {};
    $scope.data.showSearch = true;

    $scope.clearSearch = function() {
        $scope.data.searchQuery = '';
    };

    $scope.clearSearch = function() {
        $scope.data.searchQuery = '';
    };
	
	$scope.clickRU = function(ruID){
		console.log(ruID); //TODO Load the detailed view
    }
		
    rulistservice.getrulist().then(function(result){
        console.log(result);
        $scope.rulist = result.data;
    });

}]);