wtf.factory('User', ['loginservice', '$http', '$localStorage', function (loginservice, $http, $localStorage) {

  var factory = {
    /*Warning, there may be a problem with that:
     it is used both to store "toques", which is a list of users
     and a user query response, directly at the root.
     In the current code the only queried user is "me", so we should consider using 2 different variables
     */
    storage: {},

    /* Will return ALL users with an avatar */
    getToques: function () {
      var req = {
        method: 'GET',
        dataType: 'json',
        url: loginservice.getServerAPI() +'/users/toques?avatar=true',
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+ loginservice.gettoken()
        }
      };

      return $http(req)
      .success(function (data, status, headers, config) {
        factory.storage.toques = data;
        return data;
      });
    },

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
        method: 'POST',
        dataType: 'json',
        data: {
          action: 'increase_points'
        },
        url: loginservice.getServerAPI() +'/users/me/action',
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

    updatePreferences: function (field_id, value) {
      factory.storage.preferences[field_id] = value;
      var req = {
        method: 'PUT',
        dataType: 'json',
        data: { preferences: factory.storage.preferences },
        url: loginservice.getServerAPI() +'/users/me/preferences',
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
