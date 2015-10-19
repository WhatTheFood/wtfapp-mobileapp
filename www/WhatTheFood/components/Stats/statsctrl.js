wtf.controller('statsctrl', ['$scope', '$state', 'loginservice', 'Stats',
function ($scope, $state, loginservice, Stats) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  Stats.getStats().then(function (response) {
    $scope.stats = response.data;
    $scope.friends = response.data.friends;
    $scope.restaurants = response.data.restaurants;
    console.log("get stats");
  });

}]);
