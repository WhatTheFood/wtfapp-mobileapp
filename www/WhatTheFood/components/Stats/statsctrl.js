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
        ['Chef Toqué', 1999]
    ]

    $scope.level_1_class = "level-normal";
    $scope.level_2_class = "level-normal";
    $scope.level_3_class = "level-normal";
    $scope.level_4_class = "level-normal";
    $scope.level_1_orange = ".png";
    $scope.level_2_orange = ".png";
    $scope.level_3_orange = ".png";
    $scope.level_4_orange = ".png";

    $scope.level_width = 0;

    var score = $scope.stats.me.score;
    for (var i=0; i<levels.length; i++) {
        $scope.level_id = i;
        $scope.level = levels[i][0];
        $scope["level_"+(i+1)+"_orange"] = "_orange.png";

        /* break if current level is not complete */
        if(score <= levels[i][1]){
            $scope.next_level_pts = levels[i][1] + 1 - score;
            if(i > 0) {
                $scope.level_width += 25 * (score - levels[i-1][1]) / (levels[i][1] - levels[i-1][1]);
            } else {
                $scope.level_width += 25 * (score / levels[i][1]);
            }
            $scope["level_"+(i+1)+"_class"] = "level-current";
            break;
        } else if(i == levels.length-1){
            /* last level */
            $scope.next_level_pts = 0;
            $scope.level = "Toqué d\'Or";
            $scope.level_id = i+1;
            break;
        }

        $scope.level_width += 25;
    }

    /* minimum 5% */
    if($scope.level_width < 5) {
        $scope.level_width = 5;
    }
  });
}]);
