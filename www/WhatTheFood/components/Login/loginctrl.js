wtf.controller('loginctrl', ['$scope', '$state', '$http', 'loginservice', '$cordovaOauth', '$sessionStorage', '$ionicLoading', '$ionicPopup',
function ($scope, $state, $http, loginservice, $cordovaOauth, $sessionStorage, $ionicLoading, $ionicPopup) {

  if (loginservice.gettoken() !== null && $sessionStorage.userId !== null && $sessionStorage.userId !== undefined) { $state.go('login'); return; }

  $scope.gohome = function(){
    $state.go('wtf.rulist');
  };

  $scope.submitFormSignUp = function(form, email, pwd, pwd_confirm) {

    if(form.email.$valid && form.pwd.$valid && pwd == pwd_confirm) {

      $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
      });

      $scope.signup = false;
      loginservice.signup(email, pwd).then(
        function (result) {
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

  $scope.submitFormSignIn = function ( form, email, pwd) {

    if (form.email.$valid && form.pwd.$valid) {

      $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
      });

      loginservice.signin(email, pwd).then(
        function(result){
          $ionicLoading.hide();
          $scope.gohome();
        },
        function(e){
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
      function(res, msg) {
        $ionicLoading.hide();
        if (res !== true) {
          $ionicPopup.alert({
            title: "Erreur: " + msg
          });
        }
        else {
          loginservice.getfriendlist();
          $state.go("wtf.rulist");
        }
      },
      function(e) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: "Erreur lors de la connexion Facebook..."
        });
      }
    );
  };
}]);
