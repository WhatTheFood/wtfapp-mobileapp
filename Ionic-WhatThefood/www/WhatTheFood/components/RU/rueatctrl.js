wtf.controller('rueatctrl', ['$scope', '$stateParams', 'rulistservice', function($scope, $stateParams, rulistservice) {
    console.log($stateParams);
    console.log(rulistservice.restaurants);
    var restaurant = rulistservice.restaurants.filter(function(restaurant) {
        return restaurant.id == $stateParams.ruId;
    })
    $scope.ru = restaurant[0];
    console.log($scope.ru);
}]);