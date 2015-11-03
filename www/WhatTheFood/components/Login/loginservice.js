wtf.factory('loginservice', ['$http', '$q', '$sessionStorage', '$localStorage',
function($http, $q, $sessionStorage, $localStorage) {

  var $storage = $sessionStorage.$default({
    facebook: false,
    token: null
  });


  // var serverAPI = "/api";
  // Debug handy
  // var serverAPI = "http://localhost:5000/api"; // Local
  var serverAPI = "https://m.whatthefoodapp.fr/api"; //prod

  function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  var factory = {

    getServerAPI: function() {
      return serverAPI;
    },
    /*
    getServerAPILogin: function(user, password) {
      return "/" + user.replace("@","%40") + ":" + password + "@" + serverAPI;
    },
    */

    signup: function (data) {
      var req = {
        method: 'POST',
        dataType: "json",
        url: factory.getServerAPI()+'/users/',
        data: {
          first_name: data.firstname,
          last_name: data.lastname,
          email: data.email,
          password: data.password
        },
        headers: {"Content-Type": "application/json"}
      };

      return $http(req)
      .success(function (data, status, headers, config) {
        factory.settoken(data['token']);
        return data;
      })
      .error(function (data, status, headers, config) {
        if (data === null || data === undefined) {
          alert('Assurez vous d\'être connecté à internet.');
          return null;

        } else {
          console.error("Error: " + JSON.stringify(data) + ", status: " + status);
          return data;
        }
      });
    },

    signin: function (email, pwd) {
      var req = {
        method: 'POST',
        url: factory.getServerAPI() + '/auth/local',
        data: {
          email: email,
          password: pwd
        }
      };

      return $http(req)
      .success(function (data, status, headers, config) {
        factory.settoken(data['token']);
        return data;
      })
      .error(function (data, status, headers, config) {
        console.error("Error: " + JSON.stringify(data) + ", status: " + status);
        return data;
      });
    },

    loginfb: function () {
      var defer = $q.defer();

      var facebookApiRequestSuccessHandler = function (response, user) {
        var req = {
          method: 'PUT',
          dataType: "json",
          url: factory.getServerAPI() +'/auth/facebook/',
          data: '{"email":"'+ user.email +'","token":"'+ response.authResponse.accessToken +'"}',
          headers: { "Content-Type" : "application/json" }
        };

        $http(req)
        .success(function (data, status, headers, config) {
          factory.settoken(data['token']);
          $storage.facebook = true;
          defer.resolve(true, data);
        })
        .error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.error("Facebook connection error on api: ", data);
          defer.reject(false, data);
        });
      };

      var facebookLoginHandler = function (response) {
        if (response.status === 'connected') {

          openFB.api({
            path: '/v2.4/me',
            params: {
              fields: ['id','first_name','last_name','email']
            },
            success: function(user) {
              return facebookApiRequestSuccessHandler(response, user);
            },
            error: function(error) {
              defer.reject(false, 'Impossible de récupérer l\'email');
            }
          });
        } else {
          defer.reject(false, 'Login Facebook impossible...');
        }
      };

      openFB.login(
        function(response) { return facebookLoginHandler(response); },
        {scope: 'public_profile,email,user_friends', return_scopes: true}
      );

      return defer.promise;
    },

    logout: function () {
      factory.settoken(null);
      $storage.facebook = false;
      $sessionStorage.$reset();
      $localStorage.$reset();
      return false;
    },

    getfriendlist: function() {
      var defer = $q.defer();
      openFB.api({path: '/me/friends',
                 success: function(friendlist) {
                   defer.resolve(friendlist);
                 },
                 error: function() {
                   defer.reject('Impossible de récupérer la liste d\'amis');
                 }
      });

      return defer.promise;
    },

    gettoken: function () {
      return $storage.token;
    },

    isfbconnected: function () {
      return $storage.facebook;
    },

    islogged: function () {
      return $storage.token !== null;
    },

    settoken: function (data) {
      $storage.token = data;
    }
  };

  return factory;
}]);
