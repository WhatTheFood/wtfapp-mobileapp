wtf.controller('rucontentctrl', ['$scope', '$sce', '$sessionStorage', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
function($scope, $sce, $sessionStorage, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  if (rulistservice.restaurants.length > 0) {
    $ionicLoading.show({
      template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
    });

    var restaurant = rulistservice.restaurants.filter(function(restaurant) {
      return restaurant.id == $stateParams.ruId;
    });

    if (restaurant.length > 0) {
      rulistservice.facebookFriendsAtThisRu(restaurant[0].id, loginservice).then(function(result){
        $scope.facebookFriendsAtThisRu = result.data;
        $ionicLoading.hide();
        console.log("FRIENDS: " + $scope.facebookFriendsAtThisRu);
      }, function(data){
        // In case of error, just hide the loading
        $ionicLoading.hide();
      });
    }

    $scope.ru = restaurant[0];
    $scope.setContextRu($scope.ru);

    /* estimated time */
    var waitingTimes = [
      {title:'Tu rentres dans le RU en moonwalk', img:'img/clock_green.png'},
      {title:'Juste le temps de rêvasser', img:'img/clock_orange.png'},
      {title:'On peut y réviser ses partiels', img:'img/clock_red.png'}
    ];

    /**
     * Get the current time estimation as a timeSlot index
     */
    var getQueueIndex = function(ru) {
      if(ru.queue.value === 0)
        return -1;

      if(ru.queue.value > 66)
        return 2;
      else if(ru.queue.value > 33)
        return 1;
      else
        return 0;
    };

    if ($scope.ru) {
      $scope.clockIndex = getQueueIndex($scope.ru);
      if($scope.clockIndex > -1) {
        $scope.clockImage = waitingTimes[$scope.clockIndex].img;
        $scope.clockTitle = waitingTimes[$scope.clockIndex].title;
      }
    } else {
      $scope.clockIndex = -1;
    }

    if ($scope.ru) {
      // BEHOLD the wonderful regex of 3:14 AM !
      // It matches any number that are directly followed by any letter except 'h' and 'H', and adds a line break there! すばらしい！
      $scope.operationalhours = $sce.trustAsHtml($scope.ru.operationalhours.replace(/[[0-9](?=[a-zA-Z])(?=[^hH])/g, "$&<br />"));
      $scope.access = $sce.trustAsHtml($scope.ru.access.replace(/[?]/g, "?<br />"));
    }
  }

  $scope.groups = [
    {'name': 'En apprendre plus sur ce RU', 'items': []}
  ];

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
    setTimeout(function () {
      $ionicScrollDelegate.scrollBottom(true);
    }, 120);
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
}]);
