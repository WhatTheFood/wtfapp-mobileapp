192.168.2.126 by Rony on 14/02/2015.
*/


wtf.controller('rulistctrl', ['$scope', '$http', 'rulistservice', function($scope, $http, rulistservice) {
	
    $scope.data = {};
    $scope.data.showSearch = true;
	
    $scope.clearSearch = function() {
        $scope.data.searchQuery = '';
	};
	
    $scope.eathere = function(id) {
        console.log(id);
		
		var req = {
			method: 'POST',
			dataType: "json",
			url: 'http://192.168.2.126:5000/api/users/me/restaurant',
			data: '{"restaurantId":'+id+'}',
			headers: { "Content-Type" : "application/json" }
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
			return "error";
		});
	};
    
    $scope.showDishCategory = function(category){
		return category.name == 'Plats' || 
        category.name == 'Grillades';
	};
	
    rulistservice.getrulist().then(function(result){
        console.log(result);
        $scope.rulist = result.data;
        rulistservice.getPosition().then(function(coord){
            console.log(coord);
            rulistservice.getrulist(coord.latitude,coord.longitude).then(function(result){
                var data2 =  result.data.map(function(val){
                    console.log(val);
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
