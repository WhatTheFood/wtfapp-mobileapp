wtf.controller('lunchthanksctrl', ['$scope', '$sessionStorage', '$state', 'loginservice', 'User',

function($scope, $sessionStorage, $state, loginservice, User) {

  /* return to login if not connected */
  if (loginservice.gettoken() === null) { $state.go('login'); return; }

  if (!User.storage._id) {
    User.query($sessionStorage.userId).then(function (response) {
      $scope.user = response.data;
    });

    $scope.$watch('user', function (newValue) {
      if (newValue !== undefined) {
        execute();
      }
    });
  } else {
    execute();
  }

  var execute = function () {
    User.updatePoints();
  };
}]);
