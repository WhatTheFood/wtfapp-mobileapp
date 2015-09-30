wtf.controller('aboutctrl', ['$scope', '$state', 'User', 'loginservice',
function ($scope, $state, User, loginservice) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  User.getToques().then(function (response) {
    $scope.toques = response.data;
  });

}]);
