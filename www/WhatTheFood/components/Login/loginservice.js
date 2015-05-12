wtf.factory('loginservice', ['$http', '$q', '$sessionStorage',
function($http, $q, $sessionStorage) {

  var $storage = $sessionStorage.$default({
    facebook: false,
    token: null,
    userId: null
  });

  var serverAPIHTTPS = true;
  var serverAPI = "whatthefood.herokuapp.com/api";
  // Debug handy
  //var serverAPIHTTPS = false;
  //var serverAPI = "192.168.0.23:5000/api"; // Home
  //var serverAPI = "192.168.2.48:5000/api"; // Make Sense

  function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  var factory = {

    getServerAPI: function() {
      return "http" + (serverAPIHTTPS ? "s" : "") + "://" + serverAPI;
    },

    getServerAPILogin: function(user,password) {
      return "http" + (serverAPIHTTPS ? "s" : "") + "://" + user.replace("@","%40") + ":" + password + "@" + serverAPI;
    },

    signup: function (email, pwd) {
      var req = {
        method: 'POST',
        dataType: "json",
        url: factory.getServerAPI()+'/users/',
        data: {
          email: email,
          password: pwd,
          auth_token: utf8_to_b64(email + ":" + pwd)
        },
        headers: {"Content-Type": "application/json"}
      };

      return $http(req)
      .success(function (data, status, headers, config) {
        console.debug("Success: ", data);
        factory.settoken(data['token']);
        $storage.userId = data['user_id'];
        return data;
      })
      .error(function (data, status, headers, config) {
        if (data === null || data === undefined) {
          alert('Assurez vous d\'être connecté à internet.');
          return null;

        } else {
          console.error("Error: ", data);
          return data;
        }
      });
    },

    signin: function (email, pwd) {
      var req = {
        method: 'GET',
        url: factory.getServerAPI() + '/users/login',
        headers: {
          Authorization: "Basic " + utf8_to_b64(email + ":" + pwd)
        }
      };

      return $http(req)
      .success(function (data, status, headers, config) {
        factory.settoken(data['user_token']);
        $storage.userId = data['user_id'];
        return data;
      })
      .error(function (data, status, headers, config) {
        console.error("Error: " + data);
        return data;
      });
    },

    loginfb: function () {
      var defer = $q.defer();

      var facebookApiRequestSuccessHandler = function (response, user) {
        var req = {
          method: 'PUT',
          dataType: "json",
          url: factory.getServerAPI() +'/users/login/facebook',
          data: '{"email":"'+ user.email +'","token":"'+ response.authResponse.token +'"}',
          headers: { "Content-Type" : "application/json" }
        };

        $http(req)
        .success(function (data, status, headers, config) {
          factory.settoken(data['user_token']);
          $storage.userId = data['user_id'];
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
          console.debug('Login Facebook reussie : '+response.authResponse.token);

          openFB.api({path: '/me',
                     success: function(user) {
                       return facebookApiRequestSuccessHandler(response, user);
                     },
                     error: function() {
                       defer.reject(false, 'Impossible de récupérer l\'email');
                     }
          });
        } else {
          alert('Login Facebook impossible...');
        }
      };

      openFB.login(
        function(response) { return facebookLoginHandler(response); },
        {scope: 'email,user_friends'}
      );
      console.debug('Login Facebook en cours...');

      return defer.promise;
    },

    getfriendlist: function() {
      var defer = $q.defer();
      openFB.api({path: '/me/friends',
                 success: function(friendlist) {
                   console.debug(friendlist);
                   defer.resolve(friendlist);
                 },
                 error: function() {
                   defer.reject('Impossible de récupérer la liste d\'amis');
                 }
      });

      return defer.promise;
    },

    gettoken: function () {
      console.info("token-get: ", $storage.token);
      return $storage.token;
    },

    isfbconnected: function () {
      return $storage.facebook;
    },

    settoken: function (data) {
      $storage.token = data;
      console.info("token-set: ", $storage.token);
    }
  };

  return factory;
}]);
