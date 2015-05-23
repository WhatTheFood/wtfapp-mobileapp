wtf.controller('aboutctrl', ['$scope', 'User',
function ($scope, User) {

  User.getToques().then(function (response) {
    $scope.toques = response.data;
  });

}]);
