wtf.controller('statsctrl', ['$scope', '$state', 'loginservice', 'User',
function ($scope, $state, loginservice, User) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  User.query('me').then(function (response) {
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
