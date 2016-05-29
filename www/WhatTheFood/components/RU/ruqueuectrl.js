wtf.controller('ruqueuectrl', ['$scope', '$state', '$stateParams', '$ionicHistory', '$ionicLoading', '$http', 'rulistservice', 'loginservice','User',

function ($scope, $state, $stateParams, $ionicHistory, $ionicLoading, $http, rulistservice, loginservice,User) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });


  $scope.init = function() {

    User.query('me').then(function(res) {
      var user = res.data;

      rulistservice.getRestaurants(function (restaurants) {
        $scope.rulist = restaurants;
        rulistservice.updateUserPreference(user);
        $scope.currentRu = rulistservice.getDefaultCurrentRu();
      });
    });
  };

  $scope.init();

  /* waiting times */
  $scope.waitingTimes = [
    {index: 0, title:'Je rentre dans le RU en moonwalk', img:'img/clock_green.png'},
    {index: 1, title:'Juste le temps de rêvasser', img:'img/clock_orange.png'},
    {index: 2, title:'On peut y réviser ses partiels', img:'img/clock_red.png'}
  ];


  $scope.checkin = function(index) {

    if($scope.currentRu == null) return "error";

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var req = {
      method: 'POST',
      dataType: "json",
      url: loginservice.getServerAPI() +'/users/me/restaurant',
      data: '{"restaurantId": '+ $scope.currentRu.id +', "when": "' + hour + ':' + min + '"}',
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer "+ loginservice.gettoken()
      }
    };

    $http(req)
    .success(function (data) {
      return data;
    })
    .error(function (data) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.error(data);
      return "error";
    });
  }


  $scope.sendVote = function (index) {

    if($scope.currentRu == null) return "error";

    var req = {
      method: 'POST',
      dataType: "json",
      url: loginservice.getServerAPI() +'/restaurants/'+ $scope.currentRu.id +'/queue/votes',
      data: '{"timeSlotIndex": '+ index +'}',
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer "+ loginservice.gettoken()
      }
    };

    $http(req)
    .success(function (data) {
        $scope.checkin($scope.currentRu.id);
        rulistservice.setCurrentRu($scope.currentRu.id);
        var restaurant = $scope.currentRu;
        restaurant.queue.value = data.queue.value;
        restaurant.queueInfoUpdatedAt = new Date(data.queue.updatedAt || rulistservice.lastUpdate);
        $scope.currentRu = rulistservice.getCurrentRu();
        $ionicHistory.goBack();
      return data;
    })
    .error(function (data) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.error(data);
      return "error";
    });
  };
}]);
