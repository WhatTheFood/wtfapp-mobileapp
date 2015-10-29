wtf.controller('loginctrl', ['$scope', '$state', '$stateParams', '$http', 'loginservice', '$cordovaOauth', '$ionicLoading', '$ionicPopup',
function ($scope, $state, $stateParams, $http, loginservice, $cordovaOauth, $ionicLoading, $ionicPopup) {

  if (loginservice.islogged()) {
    console.info('Redirecting user to list of RU, already logged in.');
    console.log( $state.go('wtf.rulist') );
    return;
  }

  $scope.gohome = function (){
    console.info('Redirecting user to list of RU.');
    $state.go('wtf.rulist')
  };

  $scope.submitFormSignUp = function (form) {

    var firstname             = form.firstname.$modelValue;
    var lastname              = form.lastname.$modelValue;
    var email                 = form.email.$modelValue;
    var password              = form.password.$modelValue;
    var password_confirmation = form.password_confirmation.$modelValue;

    if (form.email.$valid && form.password.$valid && password == password_confirmation) {

      $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i><br> ' + get_random_funny_wait_msgs()
      });

      var user = {
        email:     email,
        firstname: firstname,
        lastname:  lastname,
        password:  password
      };

      $scope.signup = false;
      loginservice.signup(user).then(
        function (result) {
          console.info('User is successfully signed up.');
          $ionicLoading.hide();
          $scope.gohome();
        },

        function (e) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Erreur de connexion...'
          });
        }
      );

    } else {
      $ionicPopup.alert({
        title: 'Il y a des erreurs dans le formulaire !'
      });
    }
  };

  $scope.submitFormSignIn = function (form, email, password) {

    if (form.email.$valid && form.password.$valid) {

      $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i><br> ' + get_random_funny_wait_msgs()
      });

      loginservice.signin(email, password).then(
        function (result){
          $ionicLoading.hide();
          $scope.gohome();
        },
        function (e){
          $ionicLoading.hide();
          if (e.status === 401) {
            $ionicPopup.alert({
              title: 'Mauvais identifiant ou mot de passe.'
            });

          } else {
            $ionicPopup.alert({
              title: 'Erreur de connexion.'
            });
          }
        });

    } else {
      $ionicPopup.alert({
        title: 'Il y a des erreurs dans le formulaire !'
      });
    }
  };

  $scope.fblogin = function () {
    $ionicLoading.show({
      template: '<i class="button-icon icon ion-loading-a"></i><br> ' + get_random_funny_wait_msgs()
    });

    loginservice.loginfb().then(
      function (res, msg) {
        $ionicLoading.hide();
        if (res !== true) {
          $ionicPopup.alert({
            title: "Erreur: " + msg
          });

        } else {
          loginservice.getfriendlist();
          $state.go("wtf.rulist");
        }
      },
      function (e) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: "Erreur lors de la connexion Facebook..."
        });
      }
    );
  };
}]);
