wtf.controller('loginctrl', ['$scope','$state','$http','loginservice','$cordovaOauth','$localStorage',
    function($scope, $state, $http, loginservice, $cordovaOauth, $localStorage ) {

        $scope.gohome = function(){
            $state.go('wtf.rulist');
        };

        $scope.fblogin = function()  {
            loginservice.loginfb().then(function(user) {
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
