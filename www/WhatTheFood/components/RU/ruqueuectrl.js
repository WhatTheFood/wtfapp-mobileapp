wtf.controller('ruqueuectrl', ['$scope', '$state', '$stateParams', '$ionicHistory', '$ionicLoading', '$http', 'rulistservice', 'loginservice',

function ($scope, $state, $stateParams, $ionicHistory, $ionicLoading, $http, rulistservice, loginservice) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });


  $scope.init = function() {

    rulistservice.getRestaurants(function(restaurants){
      $scope.rulist = restaurants;

      rulistservice.getMenus( function(menus){
        $scope.menus = menus
        rulistservice.updateMenusInRestaurants();

        if (!$scope.currentRu){
          $scope.currentRu =  rulistservice.getFavoriteRu();
        } else {
          $scope.currentRu = {};
        }


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
      // this callback will be called asynchronously
      // when the response is available
      $ionicHistory.goBack();
        var restaurant = rulistservice.restaurantsById[$scope.currentRu.id]
        restaurant.queue.value = data.queue.value;
        restaurant.queueInfoUpdatedAt = new Date(data.queue.updatedAt || rulistservice.lastUpdate);
        console.log("queue info updated")
      return data;
    })
    .error(function (data) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(data);
      return "error";
    });
  };
}]);
