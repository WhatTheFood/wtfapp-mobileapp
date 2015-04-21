wtf.controller('rueatctrl', ['$scope', '$stateParams', '$http', 'rulistservice', 'loginservice', function($scope, $stateParams, $http, rulistservice, loginservice) {

  /* return to login if not connected */
  if(loginservice.gettoken() === "") {$state.go('login'); return;}

  console.log($stateParams);
  console.log(rulistservice.restaurants);
  var restaurant = rulistservice.restaurants.filter(function(restaurant) {
    return restaurant.id == $stateParams.ruId;
  });
  $scope.ru = restaurant[0];
  $scope.setContextRu($scope.ru);

  $scope.hour = "";

  $scope.hours = ['11h30', '12h00', '12h30', '13h00', '13h30'];
  $scope.eatHere = function(id, when) {

    if (when === undefined) {
      when = $scope.hour;
    }
    //Don't execute if there is no token
    if(loginservice.gettoken() === "") return "not connected";
    // TODO verify when
    var req = {
      method: 'PUT',
      dataType: "json",
      url: loginservice.getServerAPI()+'/users/me/restaurant',
      data: '{ "when":"'+ when +'", "restaurantId":'+id+ '}',
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer "+loginservice.gettoken()
      }
    };

    console.log(req);

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
  };

  $scope.getHour = function(hour) {
    $scope.hour = hour;
  };
}]);
