
wtf.service('rulistservice', ['$cordovaGeolocation', '$http', '$localStorage', '$q', 'loginservice', '$ionicLoading',
  function ($cordovaGeolocation, $http, $localStorage, $q, loginservice, $ionicLoading) {
    console.log("RU LIST SERVICE");
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
          factory.getFavoriteRu().favorite = 0;
          factory.storage.favoriteRu = idFavoriteRu;
          factory.getFavoriteRu().favorite = 1;
        },

        getFavoriteRu: function () {
          if (factory.storage.favoriteRu && factory.storage.favoriteRu > 0) {
            return factory.restaurantsById[factory.storage.favoriteRu];
          } else {
            return {};
          }
        },

        setCurrentRu: function (idFavoriteRu) {
          factory.getCurrentRu().current = 0;
          factory.storage.currentRu = idFavoriteRu;
          factory.getCurrentRu().current = 1;
          factory.storage.currentRuSelectedAt = new moment();
        },

        getCurrentRu: function () {
          if (factory.storage.currentRu && factory.storage.currentRu > 0) {
            return factory.restaurantsById[factory.storage.currentRu];
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

        updateMenusInRestaurants: function () {
          factory.restaurants.forEach(
            function (restaurant) {
              restaurant.menusByDay = {};
              factory.restaurantsById[restaurant.id] = restaurant;
            });

          factory.menus.forEach(function (menu) {
            if (factory.restaurantsById[menu.idRestaurant].menusByDay[menu.date]) {
              factory.restaurantsById[menu.idRestaurant].menusByDay[menu.date].push(menu);
            }
            else {
              factory.restaurantsById[menu.idRestaurant].menusByDay[menu.date] = [menu];
            }

          })

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

        updateUserPreference: function (user) {
          factory.setCurrentRu(user.currentRu || 0);
          factory.setFavoriteRu(user.favoriteRu || 0);
        },

        getMenus: function (callback) {
          factory.menusCallbacks.push(callback);
          $ionicLoading.hide();

        },

        getMenusD: function () {

          if (factory.menus){
            return $q.when(factory.menus);
          }
          var req = {
            method: 'GET',
            url: loginservice.getServerAPI() + '/menus/list',
            headers: {
              "Authorization": "Bearer " + loginservice.gettoken()
            }
          };

          return $http(req).then(
            function (res) {
              var menus = res.data
              factory.menus = menus;
              factory.menusCallbacks.forEach(function (cb) {
                cb(menus);
              })
              factory.menusCallbacks = [];
              return menus;
            },
            this.ERROR_HANDLER);
        },


        getRestaurantsD: function () {
          if (factory.restaurants){
            return $q.when(factory.restaurants);
          }
          var defer = $q.defer()
          var successCallback = function (data) {
            factory.msg = "Voici les RUs près de vous";
            factory.restaurants = data;
            factory.restaurantsCallbacks.forEach(function (cb) {
              cb(data);
            })
            factory.restaurantsCallbacks = [];
            defer.resolve(data)
            $ionicLoading.hide();
          }

          var errorCallback = function (error, data) {
            factory.msg = "Impossible de se connecter pour récupérer la liste des restaurants";
            defer.resolve([]);
            $ionicLoading.hide();
          };

          this.defineRUList(successCallback, errorCallback);
          return defer.promise;
        },

        getRestaurants: function (callback) {
          factory.restaurantsCallbacks.push(callback);
          $ionicLoading.hide();
        },


        defineRUList: function (successCallback, errorCallback) {
          var self = this;
          return self.getPosition(errorCallback).then(function (coord) {
            return self.getrulist(coord.latitude, coord.longitude).then(function (result) {
              var rulist = [];

              if (result.data.length > 0) {
                var data2 = result.data.map(function (val) {
                  val.distance = Math.round(val.distance);
                  val.favorite = ( val.id == factory.storage.favoriteRu) ? 1 : 0;
                  val.current = (val.id == factory.storage.currentRu) ? 1 : 0;
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
    return factory;
  }]);
