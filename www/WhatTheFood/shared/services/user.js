wtf.factory('User', ['loginservice', '$http', '$localStorage', function (loginservice, $http, $localStorage) {

  var factory = {
    /*Warning, there may be a problem with that:
     it is used both to store "toques", which is a list of users
     and a user query response, directly at the root.
     In the current code the only queried user is "me", so we should consider using 2 different variables
     */
    storage: {},
    
    userPreferences: $localStorage.userPreferences !== undefined ? $localStorage.userPreference : {
      'vegetarian': false,
      'vegan': false,
      'nopork': false,
      'noveal': false,
      'nogluten': false,
      'nopeanut': false,
      'nonut': false,
      'noeggs': false,
      'nomilk': false,
      'nofish': false,
      'nocrustacean': false,
      'nopotato': false
    },

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

    updatePreferences: function (item) {
      factory.userPreferences[item.field_id] = item.checked;
      $localStorage.userPreferences = factory.userPreferences;
      var req = {
        method: 'PUT',
        dataType: 'json',
        data: { preferences: factory.userPreferences },
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
