/**
 * Created by Rony on 14/02/2015.
 */

wtf.factory('rulistservice', function($http) {

    var req = {
        method: 'GET',
        url: 'http://94.125.162.140:5000/api/restaurants'
    };


    var factory = {

        getrulist : function(){
            return $http(req).success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                return data;
            }).error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return "error";
            });
        }
		
    };

    return factory;

});