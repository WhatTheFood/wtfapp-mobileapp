/**
 * Created by Rony on 14/02/2015.
 */

wtf.factory('rulistservice', function($http, $location, $q) {

    var req = {
        method: 'GET',
        url: 'http://94.125.162.140:5000/api/restaurants'
    };
    
    var factory = {
        restaurants: [],
        
        getPosition: function(){
            var defer = $q.defer();
            
            navigator.geolocation.getCurrentPosition(function(result) {
                console.log("localisation", result);
                defer.resolve(result.coords);
            }, function(err) {
                if(err.code && err.code === 1) {
                    defer.reject("Vous devez autoriser la géolocalisation \npour que cette application fonctionne.");
                    alert("Vous devez autoriser la géolocalisation \npour que cette application fonctionne.");
                } else {
                    //more generic error
                    defer.reject("Nous sommes désolé, nous ne sommes pas capables\nde récupérer votre position.\n" + "Err Code: "+err.code);
                    alert("Nous sommes désolé, nous ne sommes pas capables\nde récupérer votre position.\n" + "Err Code: "+err.code);
                }
                console.log(err);
            },{enableHighAccuracy:true, timeout:60*1000});
            
            return defer.promise;
        },
        
        getrulist : function(lat,lng){
            console.log('Requesting restaurants');
            req.params = {
                lat:lat, 
                lng:lng
            };
            
            return $http(req).success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                factory.restaurants = data.map(function(restaurant){
                    console.log(restaurant);
                    //Force the date to a date where there is a menu (no menu on week-ends)
                    var now = new Date(Date.parse("2015-02-10T00:00:00.000Z"));
                    var menus = restaurant.menus.filter(function(menu) {
                        var menuDate = new Date(Date.parse(menu.date));
                        return (now.getDate() == menuDate.getDate() 
                        && now.getMonth() == menuDate.getMonth()
                        && now.getFullYear() == menuDate.getFullYear());
                    })
                    restaurant.menu = menus[0];
                    return restaurant;
                });
                return factory.restaurants;
            }).error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return "error";
            });
        }
		
    };

    return factory;

});