var factory = {
  lastUpdate: new Date(),
  menusCallbacks: [],
  restaurantsCallbacks: [],
  restaurantsById: {},

  currentRu: 0,
  currentRuSelectedAt: new moment(0),
  favoriteRu: 0,

  setFavoriteRu: function (idFavoriteRu) {
    this.getFavoriteRu().favorite = 0;
    this.storage.favoriteRu = idFavoriteRu;
    this.getFavoriteRu().favorite = 1;
  },

  getFavoriteRu: function () {
    if (this.storage.favoriteRu && this.storage.favoriteRu > 0) {
      return this.restaurantsById[this.storage.favoriteRu];
    } else {
      return {};
    }
  },

  setCurrentRu: function (idFavoriteRu) {
    this.getCurrentRu().current = 0;
    this.storage.currentRu = idFavoriteRu;
    this.getCurrentRu().current = 1;
    this.storage.currentRuSelectedAt = new moment();
  },

  getCurrentRu: function () {
    if (this.storage.currentRu && this.storage.currentRu > 0) {
      return this.restaurantsById[this.storage.currentRu];
    } else {
      return {};
    }
  },
  getDefaultCurrentRu: function () {
    var defaultRu = this.getCurrentRu();
    if (!defaultRu.id) {
      defaultRu = this.getFavoriteRu();
    }
    if (!defaultRu.id) {
      defaultRu = this.restaurants[0];
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
    this.restaurantsById = {};

    this.restaurants.forEach(
      function (restaurant) {
        restaurant.menusByDay = {};
        this.restaurantsById[restaurant.id] = restaurant;
      });

    this.menus.forEach(function (menu) {
      if (this.restaurantsById[menu.idRestaurant].menusByDay[menu.date]) {
        this.restaurantsById[menu.idRestaurant].menusByDay[menu.date].push(menu);
      }
      else {
        this.restaurantsById[menu.idRestaurant].menusByDay[menu.date] = [menu];
      }

    })

    this.restaurants.forEach(function (restaurant) {
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
    this.setCurrentRu(user.currentRu || 0);
    this.setFavoriteRu(user.favoriteRu || 0);
  },

  getMenus: function (callback) {


    callback();
    $ionicLoading.hide();
    return;
  },

  getMenusD: function () {

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
        console.log(menus);
        this.menus = menus;
        this.menusCallbacks.forEach(function (cb) {
          cb(this.menus);
          this.menusCallbacks = [];
        })
        return menus;
      },
      this.ERROR_HANDLER);
  },


  getRestaurantsD: function () {
    var defer = $q.defer()
    var successCallback = function (data) {
      this.msg = "Voici les RUs près de vous";
      this.restaurants = data;
      this.restaurantsCallbacks.forEach(function (cb) {
        cb(this.restaurants);
      })
      this.restaurantsCallbacks = [];
      defer.resolve(data)
      $ionicLoading.hide();
    }

    var errorCallback = function (error, data) {
      this.msg = "Impossible de se connecter pour récupérer la liste des restaurants";
      defer.resolve([]);
      $ionicLoading.hide();
    };

    this.defineRUList(successCallback, errorCallback);
    return defer.promise;
  },

  getRestaurants: function (callback) {
    callback();
    $ionicLoading.hide();
    return;
  },

  defineRUList: function (successCallback, errorCallback) {
    var self = this;
    return self.getPosition(errorCallback).then(function (coord) {
      return self.getrulist(coord.latitude, coord.longitude).then(function (result) {
        var rulist = [];

        if (result.data.length > 0) {
          var data2 = result.data.map(function (val) {
            val.distance = Math.round(val.distance);
            val.favorite = ( val.id == this.storage.favoriteRu) ? 1 : 0;
            val.current = (val.id == this.storage.currentRu) ? 1 : 0;
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
      this.storage.restaurants = data.map(function (restaurant) {
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

        restaurant.queueInfoUpdatedAt = new Date(restaurant.queue.updatedAt || this.lastUpdate);

        return restaurant;
      });

      /* convenient shortcut link */
      this.restaurants = this.storage.restaurants;

      return this.storage.restaurants;

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


wtf.service('rulistservice', ['$cordovaGeolocation', '$http', '$localStorage', '$q', 'loginservice', '$ionicLoading',
  function ($cordovaGeolocation, $http, $localStorage, $q, loginservice, $ionicLoading) {

    if (!factory.storage) {
      factory.storage = $localStorage.$default({
        restaurants: [],
        feedback: [],
        menus: [],
        currentRu: 0,
        currentRuSelectedAt: new moment(0),
        favoriteRu: 0
      })
    }

    return factory;
  }]);
