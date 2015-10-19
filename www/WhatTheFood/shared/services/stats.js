wtf.factory('Stats', ['loginservice', '$http', '$localStorage', function (loginservice, $http, $localStorage) {

  var factory = {
    storage: {} ,

    getStats: function () {
      var req = {
        method: 'GET',
        dataType: 'json',
        url: loginservice.getServerAPI() +'/stats/me',
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+ loginservice.gettoken()
        }
      };

      return $http(req)
      .success(function (data, status, headers, config) {
        factory.storage.stats = data;
        return data;
      });
    }

  };

  return factory;
}]);
