/**
 * Created by Rony on 14/02/2015.
 */


wtf.controller('rulistctrl', ['$scope', 'rulistservice', function($scope, rulistservice) {

    $scope.data = {};
    $scope.data.showSearch = true;

    $scope.clearSearch = function() {
        $scope.data.searchQuery = '';
    };

    rulistservice.getrulist().then(function(result){
        console.log(result);
        $scope.rulist = result.data;
        rulistservice.getPosition().then(function(coord){
            console.log(coord);
            rulistservice.getrulist(coord.latitude,coord.longitude).then(function(result){
                var data2 =  result.data.map(function(val){
                    console.log(val);
                    val.distance = Math.round(val.distance * 6378.137);
                    return val ;
                });

                $scope.rulist = data2;
                $scope.geomsg = "Voici les RU près de vous";
            });
        });
    });

}]);