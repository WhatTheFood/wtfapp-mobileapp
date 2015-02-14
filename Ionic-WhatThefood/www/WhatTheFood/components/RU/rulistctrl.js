/**
 * Created by Rony on 14/02/2015.
 */


wtf.controller('rulistctrl', ['$scope', 'rulistservice', function($scope, rulistservice) {

    $scope.data = {};
    $scope.data.showSearch = true;

    $scope.clearSearch = function() {
        $scope.data.searchQuery = '';
    };

    $scope.clearSearch = function() {
        $scope.data.searchQuery = '';
    };
	
	$scope.clickRU = function(ruID){
		console.log(ruID); //TODO Load the detailed view
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
	
    rulistservice.getrulist().then(function(result){
        console.log(result);
        $scope.rulist = result.data;
    });

}]);