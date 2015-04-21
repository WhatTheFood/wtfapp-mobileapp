wtf.factory('loginservice', ['$http', '$q', '$sessionStorage', function($http, $q, $sessionStorage) {

  var tokenAPI = $sessionStorage.$default({
    token: "",
    facebook: false
  });

  // var serverAPIHTTPS = true;
  // var serverAPI = "whatthefood.herokuapp.com/api";
  // Debug handy
  var serverAPIHTTPS = false;
  var serverAPI = "127.0.0.1:5000/api";

  var factory = {

    getServerAPI : function() {
      return "http" + (serverAPIHTTPS ? "s" : "") + "://" + serverAPI;
    },

    getServerAPILogin : function(user,password) {
      return "http" + (serverAPIHTTPS ? "s" : "") + "://" + user.replace("@","%40") + ":" + password + "@" + serverAPI;
    },

    signup : function(email, pwd) {
      var req = {
        method: 'POST',
        dataType: "json",
        url: factory.getServerAPI()+'/users/',
        data: {"email": email, "password": pwd},
        headers: { "Content-Type" : "application/json" }
      };
      return $http(req)
      .success(function (data, status, headers, config) {
        console.log(data);
        return data;
      })
      .error(function (data, status, headers, config) {
        console.log("Error: " + data);
        return data;
      });
    },

    signin : function(email, pwd) {
      function utf8_to_b64( str ) {
        return window.btoa(unescape(encodeURIComponent( str )));
      }

      var req = {
        method: 'GET',
        url: factory.getServerAPI() + '/users/login',
        headers: {
          Authorization: "Basic " + utf8_to_b64(email + ":" + pwd)
        }
      };

      return $http(req)
      .success(function (data, status, headers, config) {
        console.log(data);
        factory.settoken(data['user_token']);
        userId = data['user_id'];
        return data;
      })
      .error(function (data, status, headers, config) {
        console.log("Error: " + data);
        return data;
      });
    },

    loginfb : function() {
      var defer = $q.defer();

      var facebookApiRequestSuccessHandler = function (user) {
        var req = {
          method: 'PUT',
          dataType: "json",
          url: factory.getServerAPI() +'/users/login/facebook',
          data: '{"email":"'+user.email+'","token":"'+response.authResponse.token+'"}',
          headers: { "Content-Type" : "application/json" }
        };

        $http(req)
        .success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          factory.settoken(data['user_token']);
          userId = data['user_id'];
          tokenAPI.facebook = true;
          defer.resolve(true, data);
        })
        .error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log("Facebook connection error on api: ");
          console.log(data);
          defer.reject(false, data);
        });
      };

      var facebookLoginHandler = function (response) {
        if (response.status === 'connected') {
          console.log('Login Facebook reussie : '+response.authResponse.token);

          openFB.api({path: '/me',
                     success: function(user) {
                       return facebookApiRequestSuccessHandler(user);
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
        {scope: 'email,user_friends'});
        console.log('Login Facebook en cours...');

        return defer.promise;
    },

    getfriendlist : function() {
      var defer = $q.defer();
      openFB.api({path: '/me/friends',
                 success: function(friendlist) {
                   console.log(friendlist);
                   defer.resolve(friendlist);
                 },
                 error: function() {
                   defer.reject('Impossible de récupérer la liste d\'amis');
                 }
      });

      return defer.promise;
    },

    gettoken : function() {
      console.log("token-get : " + tokenAPI.token.substring(0, 20));
      return tokenAPI.token;
    },

    isfbconnected : function() {
      return tokenAPI.facebook;
    },

    settoken : function(data) {
      tokenAPI.token = data;
      console.log("token-set : " + tokenAPI.token.substring(0, 20));
    }
  };

  return factory;
}]);
