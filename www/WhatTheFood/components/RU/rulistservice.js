wtf.factory('rulistservice', ['$cordovaGeolocation', '$http', '$localStorage', '$q', 'loginservice', '$ionicLoading',
  function ($cordovaGeolocation, $http, $localStorage, $q, loginservice, $ionicLoading) {


    var factory = {
      lastUpdate: new Date(),
      menusCallbacks: [],
      restaurantsCallbacks: [],
      restaurantsById: {},

      currentRu: 0,
      currentRuSelectedAt: new moment(0),
      favoriteRu: 0,

      storage: $localStorage.$default({
        restaurants: [],
        feedback: [],
        menus: [],
        currentRu: 0,
        currentRuSelectedAt: new moment(0),
        favoriteRu: 0
      }),


      setFavoriteRu: function (idFavoriteRu) {
        if(factory.getFavoriteRu()) {
          factory.getFavoriteRu().favorite = 0;
        }
        factory.storage.favoriteRu = idFavoriteRu;
        factory.getFavoriteRu().favorite = 1;
      },

      getFavoriteRu: function () {
        if (factory.storage.favoriteRu && factory.storage.favoriteRu > 0) {
          return factory.restaurantsById[factory.storage.favoriteRu] || {};
        } else {
          return {};
        }
      },

      setCurrentRu: function (idFavoriteRu) {
        if(factory.getCurrentRu()) {
          factory.getCurrentRu().current = 0;
        }
        factory.storage.currentRu = idFavoriteRu;
        factory.getCurrentRu().current = 1;
        factory.storage.currentRuSelectedAt = new moment();
      },

      getCurrentRu: function () {
        if (factory.storage.currentRu && factory.storage.currentRu > 0) {
          return factory.restaurantsById[factory.storage.currentRu] || {};
        } else {
          return {};
        }
      },
      getDefaultCurrentRu: function () {
        var defaultRu = factory.getCurrentRu();
        if (!defaultRu.id) {
          defaultRu = factory.getFavoriteRu();
        }
        if (!defaultRu.id) {
          defaultRu = factory.restaurants[0];
        }
        return defaultRu;
      },

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
              defer.reject("T'as pas de GPS sur ton téléphone ? Bon... on va essayer de faire sans ! ;)");
              alert("T'as pas de GPS sur ton téléphone ? Bon... on va essayer de faire sans ! ;)");
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

      updateMenusInRestaurants: function () {
        factory.restaurantsById = {};

        factory.restaurants.forEach(
          function (restaurant) {
            restaurant.menusByDay = {};
            factory.restaurantsById[restaurant.id] = restaurant;
          });

        factory.menus.forEach(function (menu) {
          if(! factory.restaurantsById[menu.idRestaurant]){
            return;
          }
          if (factory.restaurantsById[menu.idRestaurant].menusByDay[menu.date]) {
            factory.restaurantsById[menu.idRestaurant].menusByDay[menu.date].push(menu);
          }
          else {
            factory.restaurantsById[menu.idRestaurant].menusByDay[menu.date] = [menu];
          }
        });

        factory.restaurants.forEach(function (restaurant) {
          restaurant.menusToday = restaurant.menusByDay[moment().format("YYYY-MM-DD")];
          if (!restaurant.menusToday) {
            restaurant.menusToday = [];
            var daymin;
            for (day in restaurant.menusByDay) {
              if (!daymin) {
                daymin = day;
              } else if (daymin > day) {
                daymin = day
              }
            }
            restaurant.menusToday = restaurant.menusByDay[daymin];
          }
        })

      },

      updateUserPreference: function(user) {
        factory.setCurrentRu(user.currentRu || 0);
        factory.setFavoriteRu(user.favoriteRu || 0);
      },

    getMenus: function (callback) {
        if (factory.menus === undefined || factory.menus.length == 0) {

          factory.menusCallbacks.push(callback);

          if (factory.menusCallbacks[0] != callback) {
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
              factory.updateMenusInRestaurants();
              factory.menusCallbacks.forEach(function (cb) {
                cb(factory.menus);
                factory.menusCallbacks = [];
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

          if (factory.restaurantsCallbacks[0] != callback) {
            return;
          }

          var successCallback = function (data) {
            this.msg = "Voici les RUs près de vous";
            factory.restaurants = data;
            factory.restaurantsCallbacks.forEach(function (cb) {
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
                val.favorite = ( val.id == factory.storage.favoriteRu)?1:0;
                val.current = (val.id == factory.storage.currentRu)?1:0;
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
        })
        .catch(function (err) {
          // handle errors
          return self.getrulist().then(function (result) {
                if (successCallback) {
                  successCallback(result.data);
                }
            }, function (e) {
            if (errorCallback) {
              errorCallback(e, []);
            }
          });
        })
      },


      getrulist: function (lat, lng) {
        var req = {
          method: 'GET',
          url: loginservice.getServerAPI() + '/restaurants',
          headers: {
            "Authorization": "Bearer " + loginservice.gettoken()
          },

          params: {
            lat: lat,
            lng: lng
          }
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

            restaurant.queueInfoUpdatedAt = new Date(restaurant.queue.updatedAt || factory.lastUpdate);

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
