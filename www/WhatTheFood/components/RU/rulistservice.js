wtf.factory('rulistservice', ['$cordovaGeolocation', '$http', '$localStorage', '$q', 'loginservice', '$ionicLoading',
  function ($cordovaGeolocation, $http, $localStorage, $q, loginservice, $ionicLoading) {

    var req = {
      method: 'GET',
      url: loginservice.getServerAPI() + '/restaurants'
    };


    var factory = {

      menusCallbacks:[],
      restaurantsCallbacks:[],

      storage: $localStorage.$default({
        restaurants: [],
        feedback: [],
        menus: []
      }),

      getPosition: function (errorCallback) {
        var defer = $q.defer();

        var positionOptions = {
          timeout: 10000,
          enableHighAccuracy: false // may cause errors if true
        };

        $cordovaGeolocation
          .getCurrentPosition(positionOptions)
          .then(function (result) {
            defer.resolve(result.coords);

          }, function (err) {
            if (err.code && err.code === 1) {
              defer.reject("Vous devez autoriser la géolocalisation \npour que cette application fonctionne.");
              alert("Vous devez autoriser la géolocalisation \npour que cette application fonctionne.");

            } else {
              // more generic error
              defer.reject("Nous sommes désolé, nous ne sommes pas capables\nde récupérer votre position.");
              alert("Nous sommes désolé, nous ne sommes pas capables\nde récupérer votre position.");
            }

            if (errorCallback) {
              return errorCallback(err);
            }
          });

        return defer.promise;
      },

      ERROR_HANDLER: function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert("Désolé, nous n'arrivons pas à accéder au serveur par internet...");
        return "error";
      },

      getMenus: function (callback) {
       if (factory.menus === undefined || factory.menus.length == 0) {

         factory.menusCallbacks.push(callback);

         if (factory.menusCallbacks[0] != callback){
           return;
         }

         var req = {
            method: 'GET',
            url: loginservice.getServerAPI() + '/menus/list',
            headers: {
              "Authorization": "Bearer " + loginservice.gettoken()
            }
          };

          $http(req).success(
            function (menus) {
              factory.menus = menus;
              factory.menusCallbacks.forEach(function (cb){
                cb(factory.menus);
                factory.menusCallbacks=[];
              })
            }
          ).error(this.ERROR_HANDLER);
        } else {
          callback(factory.menus);
        }
      },



      getRestaurants: function (callback) {
        // Ensure restaurants are defined as we depend on it
        if (factory.restaurants === undefined || factory.restaurants.length == 0) {

          factory.restaurantsCallbacks.push(callback);

          if (factory.restaurantsCallbacks[0] != callback){
            return;
          }

          var successCallback = function (data) {
            this.msg = "Voici les RUs près de vous";
            factory.restaurants = data;
            factory.restaurantsCallbacks.forEach(function (cb){
              cb(factory.restaurants);
            })
            factory.restaurantsCallbacks = [];

            $ionicLoading.hide();
          };

          var errorCallback = function (error, data) {
            this.msg = "Impossible de se connecter pour récupérer la liste des restaurants";
            $ionicLoading.hide();
          };

          this.defineRUList(successCallback, errorCallback);

        } else {
          callback(factory.restaurants);
          $ionicLoading.hide();
        }
      },

      defineRUList: function (successCallback, errorCallback) {
        var self = this;
        return self.getPosition(errorCallback).then(function (coord) {
          return self.getrulist(coord.latitude, coord.longitude).then(function (result) {
            var rulist = [];

            if (result.data.length > 0) {
              var data2 = result.data.map(function (val) {
                val.distance = Math.round(val.distance);
                return val;
              });


              if (successCallback) {
                successCallback(data2);
              }

            } else {
              self.getrulist().then(function (result) {
                if (successCallback) {
                  successCallback(result.data);
                }
              });
            }

          }, function (e) {
            if (errorCallback) {
              errorCallback(e, []);
            }
          });
        });
      },


      getrulist: function (lat, lng) {
        req.params = {
          lat: lat,
          lng: lng
        };

        return $http(req).success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          factory.storage.restaurants = data.map(function (restaurant) {
            // Force the date to a date where there is a menu (no menu on week-ends)
            // var now = new Date(Date.parse("2015-03-30T00:00:00.000Z")); // DEBUG HANDY!
            var now = new Date();
            var menus = restaurant.menus.filter(function (menu) {
              var menuDate = new Date(Date.parse(menu.date));
              return (now.getDate() == menuDate.getDate()
              && now.getMonth() == menuDate.getMonth()
              && now.getFullYear() == menuDate.getFullYear());
            });

            restaurant.menus = menus;
            var openingCodes = restaurant.opening.split(',');
            restaurant.openingString = openingCodes.map(function (openingCode) {
              if (openingCode == "000") return "Fermé";
              else if (openingCode == "100") return "Ouvert ce matin";
              else if (openingCode == "010") return "Ouvert ce midi";
              else if (openingCode == "001") return "Ouvert ce soir";
              else if (openingCode == "110") return "Ouvert ce matin et ce midi";
              else if (openingCode == "011") return "Ouvert ce midi et ce soir";
              else if (openingCode == "101") return "Ouvert ce matin et ce soir";
              else if (openingCode == "111") return "Ouvert ce matin, ce midi et ce soir";
              return "Pas d'informations";
            });
            restaurant.openingNow = restaurant.openingString[(now.getDay() + 6) % 7];

            restaurant.queueInfoUpdatedAt = new Date();

            return restaurant;
          });

          /* convenient shortcut link */
          factory.restaurants = factory.storage.restaurants;

          return factory.storage.restaurants;

        }).error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert("Désolé, nous n'arrivons pas à accéder au serveur par internet...");
          return "error";
        });
      },
      facebookFriendsAtThisRu: function (id, loginservice) {
        // Don't execute if there is no token
        if (loginservice.gettoken() === null || !loginservice.isfbconnected()) {
          var deferred = $q.defer();
          deferred.resolve("not facebook connected");
          return deferred.promise;
        }

        var req = {
          method: 'PUT',
          dataType: "json",
          url: loginservice.getServerAPI() + '/users/me/friends/restaurant',
          data: {"restaurantId": id},
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + loginservice.gettoken()
          }
        };

        return $http(req).success(function (data, status, headers, config) {
          return data;

        }).error(function (data, status, headers, config) {
          console.log("Error - fbfriend: " + data);
          return data;
        });
      }
    };

    factory.feedback = factory.storage.feedback;

    return factory;
  }]);
