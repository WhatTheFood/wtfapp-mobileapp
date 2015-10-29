wtf.factory('User', ['loginservice', '$http', '$localStorage', function (loginservice, $http, $localStorage) {

  var factory = {
    /*Warning, there may be a problem with that:
     it is used both to store "toques", which is a list of users
     and a user query response, directly at the root.
     In the current code the only queried user is "me", so we should consider using 2 different variables
     */
    storage: {
      preferences:[]
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
          .success(function (user, status, headers, config) {
            factory.storage = user; // ??
            if (user.lastQueueFeeback){
              var lastQueueFeeback = user.lastQueueFeeback;
              if (moment().diff(lastQueueFeeback.updatedAt,'minutes') < 60){
                user.currentRu = lastQueueFeeback.currentRu;
                user.currentRuSelectedAt = lastQueueFeeback.currentRuSelectedAt;
              }
            }
            return user;
          })
          .error(function (data, status, headers, config) {
            console.error("Error: ", data);
            return data;
          });
      }
    },

    queryD: function (userId) {
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
          .then(function (res) {
            var user = res.data
            factory.storage = user; // ??
            if (user.lastQueueFeeback){
              var lastQueueFeeback = user.lastQueueFeeback;
              if (moment().diff(lastQueueFeeback.updatedAt,'minutes') < 60){
                user.currentRu = lastQueueFeeback.currentRu;
                user.currentRuSelectedAt = lastQueueFeeback.currentRuSelectedAt;
              }
            }
            return user;
          },function (data, status, headers, config) {
            console.error("Error: ", data);
            return data;
          })

      }
    },

    updatePreferences: function (key,value) {
      var req = {
        method: 'PUT',
        dataType: 'json',
        data: {
          preferences: [{
            key:key,
            value:value
          }]
        },
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
    },


    getPreferences: function (preferences) {
      var req = {
        method: 'GET',
        url: loginservice.getServerAPI() +'/users/me/preferences',
        headers: {
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
