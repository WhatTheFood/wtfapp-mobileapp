wtf.controller('ruqueuectrl', ['$scope', '$state', '$stateParams', 'rulistservice', 'loginservice', function($scope, $state, $stateParams, rulistservice, loginservice) {
   $scope.restaurants = rulistservice.restaurants;
   console.log("state params: ", $stateParams.ruId);
   $scope.modelRu = $scope.restaurants[0];
   $scope.preselectruId = $stateParams.ruId === undefined ? $scope.restaurants[0].id : $stateParams.ruId;
}]);