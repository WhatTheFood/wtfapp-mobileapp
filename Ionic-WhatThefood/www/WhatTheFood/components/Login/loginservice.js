wtf.factory('loginservice', function($http, $q) {

	var tokenAPI = "";

	//var serverAPI = "http://192.168.2.126:5000/api";
	var serverAPI = "http://localhost:5000/api";

    var factory = {
		getServerAPI : function() {
			return serverAPI;
		},

		loginfb : function() {
            var defer = $q.defer();

			openFB.login(

			function(response) {
				if (response.status === 'connected') {
					console.log('Login Facebook reussie : '+response.authResponse.token);

					openFB.api({path: '/me',
						success: function(user) {
							var req = {
								method: 'PUT',
								dataType: "json",
								url: serverAPI+'/users/login/facebook',
								data: '{"email":"'+user.email+'","token":"'+response.authResponse.token+'"}',
								headers: { "Content-Type" : "application/json" }
							};

							$http(req)
							.success(function (data, status, headers, config) {
								// this callback will be called asynchronously
								// when the response is available
								tokenAPI = data;
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
				},

		gettoken : function() {
			return tokenAPI;
		}
	}

	return factory;
});

