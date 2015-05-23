wtf.controller('aboutctrl', ['$scope', '$sessionStorage', '$state', 'User', 'loginservice',
function ($scope, $sessionStorage, $state, User, loginservice) {

  if (loginservice.gettoken() === null || $sessionStorage.userId === null || $sessionStorage.userId === undefined) { $state.go('login'); return; }

  User.getToques().then(function (response) {
    $scope.toques = response.data;
  });

}]);
