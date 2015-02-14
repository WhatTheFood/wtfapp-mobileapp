wtf.controller('loginctrl', ['$scope','$state', function($scope, $state) {
    
    $scope.gohome = function(){
        $state.go('wtf.rulist');
	}
	
	$scope.fbLogin = function() {
		openFB.login(
		function(response) {
			if (response.status === 'connected') {
				console.log('Login Facebook reussie !');
				openFB.api({path: '/me/friends',
					success: function(nb) {
						console.log(nb);
					},
				error: function() {alert('Impossible de récupérer la liste d\'amis');}});
				$scope.closeLogin();
				} else {
				alert('Login Facebook impossible...');
			}
		},
		{scope: 'email,user_friends'});
	}
}]);