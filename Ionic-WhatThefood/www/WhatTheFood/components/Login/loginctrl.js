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

/*        $scope.login = function() {
            $cordovaOauth.facebook("576723975798203", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
                $localStorage.accessToken = result.access_token;
                console.log(result);
                //$location.path("/profile");
            }, function(error) {
                alert("There was a problem signing in!  See the console for logs");
                console.log(error);
            });
        };*/

    }]);