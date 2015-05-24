wtf.controller('statsctrl', ['$scope', '$sessionStorage', '$state', 'loginservice', 'User',
function ($scope, $sessionStorage, $state, loginservice, User) {

  if (loginservice.gettoken() === null || $sessionStorage.userId === null || $sessionStorage.userId === undefined) { $state.go('login'); return; }

  User.query($sessionStorage.userId).then(function (response) {
    $scope.user = response.data;
  });

  $scope.$watch('user', function (user) {
    if (user !== undefined) {
      render(user);
    }
  });

  var render = function (user) {
  };
}]);
