wtf.factory('User', ['loginservice', '$http', '$q', '$sessionStorage', function (loginservice, $http, $q, $sessionStorage) {

  var factory = {
    storage: {},

    query: function (userId) {
      if (userId !== null && userId !== undefined) {
        var req = {
          method: 'GET',
          dataType: 'json',
          url: loginservice.getServerAPI() +'/users/'+ userId,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + loginservice.gettoken()
          }
        };

        return $http(req)
        .success(function (data, status, headers, config) {
          factory.storage = data;
          return data;
        })
        .error(function (data, status, headers, config) {
          console.error("Error: ", data);
          return data;
        });
      }
    },

    updatePoints: function () {
      var req = {
        method: 'PUT',
        dataType: 'json',
        data: { action: 'increase_points' },
        url: loginservice.getServerAPI() +'/users/'+ $sessionStorage.userId,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginservice.gettoken()
        }
      };

      return $http(req)
      .error(function (data, status, headers, config) {
        console.error('Error: ', data);
      });
    },

    updatePreferences: function (item) {
      var req = {
        method: 'PUT',
        dataType: 'json',
        data: { preference: item },
        url: loginservice.getServerAPI() +'/users/'+ $sessionStorage.userId,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginservice.gettoken()
        }
      };

      return $http(req)
      .error(function (data, status, headers, config) {
        console.error('Error: ', data);
      });
    }
  };

  return factory;
}]);