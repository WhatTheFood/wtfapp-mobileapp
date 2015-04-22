wtf.controller('rueatctrl', ['$scope', '$state', '$stateParams', '$http', 'rulistservice', 'loginservice',
function($scope, $state, $stateParams, $http, rulistservice, loginservice) {

  /* return to login if not connected */
  if (loginservice.gettoken() === "") { $state.go('login'); return; }

  var restaurant = rulistservice.restaurants.filter(function (restaurant) {
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

    if (timeIsValid(when)) {
      var req = {
        method: 'PUT',
        dataType: "json",
        url: loginservice.getServerAPI() +'/users/me/restaurant',
        data: '{ "when":"'+ when +'", "restaurantId":'+ id + '}',
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : "Bearer "+ loginservice.gettoken()
        }
      };

      $http(req)
      .success(function (data, status, headers, config) {
        $state.go('wtf.rulist');
        return data;
      })
      .error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
        return "error";
      });
    }
  };

  $scope.setHour = function(hour) {
    $scope.hour = hour;
  };

  var timeIsValid = function (when) {
    if (when === 'now' || $scope.hours.indexOf(when) > -1) {
      return true;
    }

    return false;
  };
}]);
