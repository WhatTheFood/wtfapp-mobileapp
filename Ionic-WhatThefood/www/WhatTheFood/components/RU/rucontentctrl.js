/**
 * Created by Rony on 14/02/2015.
 */

wtf.controller('rucontentctrl', ['$scope', '$sce', '$stateParams', 'rulistservice', function($scope, $sce, $stateParams, rulistservice) {
    console.log($stateParams);
    console.log(rulistservice.restaurants);
    var restaurant = rulistservice.restaurants.filter(function(restaurant) {
        return restaurant.id == $stateParams.ruId;
    })
    $scope.ru = restaurant[0];
    console.log("operational hoursssss : ");
    //$scope.ru.operationalhours = 
    $scope.operationalhours = $sce.trustAsHtml(restaurant[0].operationalhours.replace(/  /g, "<br />"));
    console.log($scope.ru);
}]);
