wtf.controller('loginctrl', ['$scope','$state','$http','loginservice','$cordovaOauth','$localStorage', '$ionicLoading',

    function($scope, $state, $http, loginservice, $cordovaOauth, $localStorage, $ionicLoading ) {

        $scope.gohome = function(){
            $state.go('wtf.rulist');
        };

        $scope.fblogin = function()  {

            $ionicLoading.show({
                template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
            });


            loginservice.loginfb().then(function(user) {
                    $ionicLoading.hide()
                    console.log("Token API : "+user);
                    if(user == "error") {
                        alert("Erreur login");
                    } else {
                        loginservice.getfriendlist();
                        $state.go("wtf.rulist");
                    }
                }
            )};
    }]);
