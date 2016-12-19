var app = angular.module("myApp", ['ngRoute','naif.base64']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login.html"
	})
    .when("/login", {
        templateUrl : "login.html"
    })
    .when("/signup", {
        templateUrl : "signup.html"
    })
    .when("/saller", {
        templateUrl : "saller.html"
	})
	.when("/customer", {
        templateUrl : "customer.html"
    })
	
});


function sellercontroller($scope,$http,$location)
{
	

	//get the name of the current logged user from localstorage
	$scope.uname = localStorage.getItem('username');
	$scope.role = localStorage.getItem('urole');
	$scope.product = {};
	$( document ).ready(function() {
		var url = window.location.href;
			//alert(url);
    		if($scope.role == 'saller' && url != 'https://ecommerce-devanshu.herokuapp.com/#/saller')
			{
				$location.path('/saller');
				$location.replace();
			}
			if($scope.role == 'customer' && url != 'https://ecommerce-devanshu.herokuapp.com/#/customer')
			{
				$location.path('/customer');
				$location.replace();
			}
			
			
	});
	
	//display all product related to that seller
	if($scope.role == 'saller')
	{
			$http({
					url: '/displaysellerproduct' ,
					dataType: 'json',
					method: 'GET',
					headers: {
						"Content-Type":"application/json",
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(response){
						if(response.status == 0)
						{
							//alert("redirection");
							$location.path('/');
							$location.replace();
						}
						else
						{  
							//alert("display data");
							$scope.names = response; 
						}
					}).error(function(error){
						//$location.path('/');
						//$location.replace();
					});
	}
	else
	{
				$http({
					url: '/allproduct' ,
					dataType: 'json',
					method: 'GET',
					headers: {
						"Content-Type":"application/json",
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(response){
						if(response.status == 0)
						{
							$location.path('/');
							$location.replace();
						}
						else
						{  $scope.names = response; }
					}).error(function(error){
						//$location.path('/');
						//$location.replace();
					});
	
	}
	
	//Display User Profile
	$scope.findone = function() {
		
		$http({
					url: '/displayuser',
					dataType: 'json',
					method: 'GET',
					headers: {
						"Content-Type":"application/json",
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(response){
						 $scope.uperson = response;
			
					}).error(function(error){
						$scope.error = error;
					});
	};
	
	//update User
	$scope.updateuser = function(uperson) {
		
		$http({
					url: '/updateuser',
					dataType: 'json',
					data:uperson,
					method: 'PUT',
					headers: {
						"Content-Type":"application/json",
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(udata){
						$scope.uperson = udata;
			
					}).error(function(error){
						$scope.error = error;
					});
	};
	
	//Seller remove product
	$scope.deleteproduct = function(name){
		
			$http({
					url: '/deleteproduct/'+ name,
					method: 'delete',
					headers: {
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(response){
						$scope.names = response;
						$scope.product = {};
					}).error(function(error){
						$scope.error = error;
					});
			
		};
	
	//update remove product
	$scope.updateone = function(name){
		
			$http({
					url: '/updateproduct/'+name,
					dataType: 'json',
					data:$scope.product1,
					method: 'PUT',
					headers: {
						"Content-Type":"application/json",
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(response){
						$scope.names = response;
						$scope.names = response;
					}).error(function(error){
						$scope.error = error;
					});
			
		};
	
	//update remove product
	$scope.findoneproduct = function(name){
		
			$http({
					url: '/oneproduct/'+ name,
					method: 'get',
					headers: {
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(response){
						$scope.product1 = response;
						//$scope.product = {};
					}).error(function(error){
						$scope.error = error;
					});
			
		};
	
	
	
	//Seller Add New Product
	$scope.addproduct = function(product){
		
			$http({
					url: '/addproduct',
					dataType: 'json',
					method: 'POST',
					data: product,
					headers: {
						"Content-Type":"application/json",
						"Authoraization":localStorage.getItem("Authoraization")
					}

					}).success(function(response){
						$scope.names = response;
						$scope.product = {};
					}).error(function(error){
						$scope.error = error;
					});
			
		};
	
	
	$scope.logout = function(){
		localStorage.clear();
		localStorage.removeItem("Authoraization");
		$location.path('/');
		$location.replace();
	};
	
}


function mainController($scope,$http,$location) {
	$scope.person = {};
	$scope.product = {};
	
	$scope.getuserprofile = function(id) {
		
		{
			$http.get('/user/' + id)
				.success(function(data) {
					$scope.uperson = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
	};
	
	$scope.findone = function(id) {
		
		{
			$http.get('/user/' + id)
				.success(function(data) {
					$scope.uperson = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
	};
	
	
	$scope.saveCustomer = function(person) {
			
			$http({
					url: '/signup',
					dataType: 'json',
					method: 'POST',
					data: person,
					headers: {
						"Content-Type":"application/json"
					}

					}).success(function(response){
						$scope.response = response;
						$scope.person = {};
						alert(response);
					}).error(function(error){
						$scope.error = error;
					});
		
	};
	
	$scope.logincust = function(person) {
			
			$http({
					url: '/login',
					dataType: 'json',
					method: 'POST',
					data: person,
					headers: {
						"Content-Type":"application/json"
					}

					}).success(function(response){
						
						if(response.Status == "1")
						{
						localStorage.setItem('Authoraization',response.AuthToken);
						localStorage.setItem('username',response.uname);
						localStorage.setItem('urole',response.Role);
						
								if(response.Role == 'saller')
								{
									$location.path('/saller');
									$location.replace();
								}
								else if(response.Role == 'customer')
								{
									$location.path('/customer');
									$location.replace();
								}
								
								$scope.person = {};
						}
						else
						{
							alert(response);
							$scope.person = {};
						}
			
					}).error(function(error){
						$scope.error = error;
					});
		
	};
	
	
	
	
}

	
	
	



