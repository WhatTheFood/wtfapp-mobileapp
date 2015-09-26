wtf.controller('aboutctrl', ['$scope', '$sessionStorage', '$state', 'User', 'loginservice',
function ($scope, $sessionStorage, $state, User, loginservice) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  User.getToques().then(function (response) {
    $scope.toques = response.data;
  });

}]);
