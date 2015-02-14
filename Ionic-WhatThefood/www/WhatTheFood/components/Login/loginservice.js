wtf.factory('loginservice', function($http, $q) {
    var factory = {
		loginfb : function() {
            var defer = $q.defer();
			
			openFB.login(
				function(response) {
					if (response.status === 'connected') {
						console.log('Login Facebook reussie !');
						
						openFB.api({path: '/me',
							success: function(user) {
								console.log(user);
								
								var req = {
									method: 'GET',
									url: 'http://94.125.162.140:5000/api/users/login/facebook',
									params: '{"email":'+user.email+',"token":'+response.authResponse.token+'}'
								};
								
								$http(req)
								.success(function (data, status, headers, config) {
									// this callback will be called asynchronously
									// when the response is available
									defer.resolve(data);
									})
								.error(function (data, status, headers, config) {
									// called asynchronously if an error occurs
									// or server returns response with an error status.
									defer.reject("error");
									});
							},
							error: function() {
								defer.reject('Impossible de récupérer l\'email');
							}
						});
						
					} else {
						alert('Login Facebook impossible...');
						
					}
				},
			{scope: 'email,user_friends'});
			console.log('Login Facebook en cours...');

			return defer.promise;
		},
		
		getfriendlist : function() {
			var defer = $q.defer();
			openFB.api({path: '/me/friends',
				success: function(friendlist) {
					console.log(friendlist);
					defer.resolve(friendlist);
				},
			error: function() {
					defer.reject('Impossible de récupérer la liste d\'amis');
				}
			});
			
			return defer.promise;
		}
		
	}
	
	return factory;
});