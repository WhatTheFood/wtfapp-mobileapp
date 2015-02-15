wtf.controller('ruqueuectrl', ['$scope', '$state', '$stateParams', 'rulistservice', 'loginservice', function($scope, $state, $stateParams, rulistservice, loginservice) {
   $scope.restaurants = rulistservice.restaurants;
   $scope.preselectru = $stateParams.ru === undefined ? $scope.restaurants[0] : $stateParams.ru;
}]);