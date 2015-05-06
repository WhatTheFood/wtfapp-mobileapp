wtf.controller('statsctrl', ['$scope', '$sessionStorage', '$state', 'loginservice', 'User',
function ($scope, $sessionStorage, $state, loginservice, User) {

  /* return to login if not connected */
  if (loginservice.gettoken() === null) { $state.go('login'); return; }

  User.query($sessionStorage.userId).then(function (response) {
    $scope.user = response.data;
  });

  $scope.$watch('user', function (user) {
    console.debug(user);
    if (user !== undefined) {
      render(user);
    }
  });

  var render = function (user) {
  };
}]);
