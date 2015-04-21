wtf.controller('rulistctrl', ['$scope', '$http', '$state', 'rulistservice', '$ionicLoading', 'loginservice', function($scope, $http, $state, rulistservice, $ionicLoading, loginservice) {

  /* return to login if not connected */
  console.log("checking connection");
  if(loginservice.gettoken() === "") { console.log("not connected"); $state.go('login'); return;}
  console.log("connected;");

  $scope.data = {};
  $scope.data.showSearch = true;

  /* estimated time */
  var clockImages = ['img/clock_green.png', 'img/clock_orange.png', 'img/clock_red.png'];

  /**
   * Get the current time estimation as a timeSlot index
   */
  $scope.getClockImage = function(queuevalue) {
    if(queuevalue === 0)
      return 'img/clock_grey.png';

    if(queuevalue > 66)
      return clockImages[2];
    else if(queuevalue > 33)
      return clockImages[1];
    else
      return clockImages[0];
  };

  $scope.clearSearch = function() {
    $scope.data.searchQuery = '';
  };

  $scope.eatHere = function(id) {
    /*
    // Don't execute if there is no token
    if(loginservice.gettoken() == "") return "not connected";
    var req = {
      method: 'POST',
      dataType: "json",
      url: loginservice.getServerAPI()+'/users/me/restaurant',
      data: '{"restaurantId":'+id+'}',
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer "+loginservice.gettoken()
      }
    };

    $http(req)
    .success(function (data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      return data;
    })
    .error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(data);
      return "error";
    });
    */
  };

  $scope.swipeleft = function(ruId) {
    setTimeout(function() {
      console.log("rueat");
      $state.go('wtf.rueat', {ruId: ruId});
    }, 500);
  };

  $scope.showDishCategory = function(category){
    return category.name == 'Plats' ||
      category.name == 'Grillades';
  };

  $scope.goEatAt = function ( ruId ) {
    $state.go('wtf.rueat', {ruId: ruId});
  };

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
  });

  rulistservice.getPosition().then(function (coord) {
    rulistservice.getrulist(coord.latitude, coord.longitude).then(function (result) {
      $scope.rulist = [];

      if (result.data.length > 0) {
        var data2 = result.data.map(function(val){
          val.distance = Math.round(val.distance * 6378.137);
          return val;
        });

        $scope.rulist = data2;

      } else {
        rulistservice.getrulist().then(function (result) {
          $scope.rulist = result.data;
        });
      }

      $scope.msg = "Voici les RUs près de vous";
      $ionicLoading.hide();

    }, function (e) {
      $scope.msg = "Impossible de se connecter pour récupérer la liste des restaurants";
      $scope.rulist = [];
      $ionicLoading.hide();
    });
  });
}]);
