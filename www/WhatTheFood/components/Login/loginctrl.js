wtf.controller('loginctrl', ['$scope', '$state', '$http', 'loginservice', '$cordovaOauth', '$sessionStorage', '$ionicLoading', '$ionicPopup',
function ($scope, $state, $http, loginservice, $cordovaOauth, $sessionStorage, $ionicLoading, $ionicPopup) {

  if (loginservice.gettoken() === null || $sessionStorage.userId === null || $sessionStorage.userId === undefined) {
    console.info('Redirecting user to login page, not logged in.');
    $state.go('login'); return;
  }
  else {
    console.info('Redirecting user to list of RU, already logged in.');
    $state.go('wtf.rulist');

  }

  $scope.gohome = function (){
    console.info('Redirecting user to list of RU.');
    $state.go('wtf.rulist');
  };

  $scope.submitFormSignUp = function (form) {

    var firstname             = form.firstname.$modelValue;
    var lastname              = form.lastname.$modelValue;
    var email                 = form.email.$modelValue;
    var password              = form.password.$modelValue;
    var password_confirmation = form.password_confirmation.$modelValue;

    if (form.email.$valid && form.password.$valid && password == password_confirmation) {

      $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
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
        template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
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
      template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
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
