wtf.factory('loginservice', function($http, $q) {
	
		var tokenAPI = "";
	
		var serverAPIHTTPS = true;
		var serverAPI = "whatthefood.herokuapp.com/api";
		//var serverAPIHTTPS = false;
		//var serverAPI = "127.0.0.1:5000/api";
	
		var factory = {

		getServerAPI : function() {
				return "http" + (serverAPIHTTPS ? "s" : "") + "://" + serverAPI;
		},
		getServerAPILogin : function(user,password) {
				return "http" + (serverAPIHTTPS ? "s" : "") + "://" + user + ":" + password + serverAPI;
		},
		
		signup : function(email, pwd)
		{
			/**
				ATTENTION : jamais testé avec un serveur en marche (mais cas d'erreur testé) - nicol3as
				Inscription testée par NicoZG : Fonctionnelle.
			**/
			var req = {
				method: 'POST',
				dataType: "json",
				url: factory.getServerAPI()+'/users/',
				data: {"email": email, "password": pwd},
				headers: { "Content-Type" : "application/json" }
			};
			return $http(req)
			.success(function (data, status, headers, config) {
				console.log(data);
				return data;
			})
			.error(function (data, status, headers, config) {
				console.log("Error: " + data);
				return data;
			});
		},
		
		signin : function(email, pwd)
		{
			/**
				ATTENTION : jamais testé avec un serveur en marche (mais cas d'erreur testé) - nicol3as
			**/
			
			var req = {
				method: 'GET',
				url: factory.getServerAPI(email, pwd) + '/users/login'
			};	// Get the URL by removing 'http://' from the server API URL
			
			return $http(req)
			.success(function (data, status, headers, config) {
				console.log(data);
				tokenAPI = data;
				return data;
			})
			.error(function (data, status, headers, config) {
				console.log("Error: " + data);
				return data;
			});
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
								defer.resolve(true, data);
							})
							.error(function (data, status, headers, config) {
								// called asynchronously if an error occurs
								// or server returns response with an error status.
								console.log("Facebook connection error on api: ")
								console.log(data);
								defer.reject(false, data);
							});
						},
						error: function() {
							defer.reject(false, 'Impossible de r�cup�rer l\'email');
						}
					});
				}
				else {
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
					defer.reject('Impossible de r�cup�rer la liste d\'amis');
				}
			});
			
						return defer.promise;
		},
		
				gettoken : function() {
						return tokenAPI;
		}
	};
	
		return factory;
});

/*wtf.factory('$localStorage', ['$window', function($window) {
	return {
	accessToken: "",
	set: function(key, value) {
	$window.localStorage[key] = value;
	},
	get: function(key, defaultValue) {
	return $window.localStorage[key] || defaultValue;
	},
	setObject: function(key, value) {
	$window.localStorage[key] = JSON.stringify(value);
	},
	getObject: function(key) {
	return JSON.parse($window.localStorage[key] || '{}');
	}
	}
}]);*/
