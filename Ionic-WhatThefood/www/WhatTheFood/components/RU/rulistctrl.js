
wtf.controller('rulistctrl', ['$scope', '$http', '$state', 'rulistservice', 'loginservice', function($scope, $http, $state, rulistservice, loginservice) {
    $scope.data = {};
    $scope.data.showSearch = true;

    $scope.clearSearch = function() {
        $scope.data.searchQuery = '';
	};

    $scope.eathere = function(id) {

		var req = {
			method: 'POST',
			dataType: "json",
			url: loginservice.getServerAPI()+'/users/me/restaurant',
			data: '{"restaurantId":'+id+'}',
			headers: {
				"Content-Type" : "application/json",
				"Authorization" : "Bearer "+loginservice.gettoken()
			}
		};

		$http(req)
		.success(function (data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			return data;
		})
		.error(function (data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log(data);
			return "error";
		});
	};


    $scope.showDishCategory = function(category){
		return category.name == 'Plats' ||
        category.name == 'Grillades';
	};

    $scope.goEatAt = function ( ruId ) {
        $state.go('wtf.rueat', {ruId: ruId});
    };

    rulistservice.getrulist().then(function(result){
        $scope.rulist = result.data;
        rulistservice.getPosition().then(function(coord){
            rulistservice.getrulist(coord.latitude,coord.longitude).then(function(result){
                var data2 =  result.data.map(function(val){
                    val.distance = Math.round(val.distance * 6378.137);
                    return val ;
				});
                $scope.rulist = data2;
                $scope.msg = "Voici les RUs près de vous";
			});
		});
		},function(e){
        $scope.msg = "Impossible de se connecter pour récupérer la liste des restaurants";
        $scope.rulist = []

	});

}]);
