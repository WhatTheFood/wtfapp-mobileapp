wtf.controller('statsctrl', ['$scope', '$state', 'loginservice', 'Stats',
function ($scope, $state, loginservice, Stats) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  Stats.getStats().then(function (response) {
    $scope.stats = response.data;
    $scope.friends = response.data.friends;
    $scope.restaurants = response.data.restaurants;
    console.log("get stats");

    var levels = [
        ['Mini-toqué', 49],
        ['Toqué', 249],
        ['Super Toqué', 649],
        ['Chef Toqué', 999]
    ]

    var score = $scope.stats.me.score;
    for (var i=0; i<levels.length; i++) {
        $scope.level_id = i;
        $scope.level = levels[i][0];
        if(score <= levels[i][1]){
            $scope.next_level_pts = levels[i][1] + 1 - score;
            break;
        }
    }
  });
}]);
