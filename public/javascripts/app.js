var app = angular.module("myApp", ['ngRoute', 'naif.base64']);

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "login.html"
		})
		.when("/login", {
			templateUrl: "login.html"
		})
		.when("/signup", {
			templateUrl: "signup.html"
		})
		.when("/saller", {
			templateUrl: "saller.html"
		})
		.when("/customer", {
			templateUrl: "customer.html"
		})
		.when("/passwordreset", {
			templateUrl: "passwordreset.html"
		})
});

function sellercontroller($scope, $http, $location) {
	
	//get the name of the current logged user from localstorage
	$scope.uname = localStorage.getItem('username');
	$scope.role = localStorage.getItem('urole');
	$scope.product = {};
	$(document).ready(function () {
		var url = window.location.href;
		if ($scope.role == 'saller' && url != 'https://ecommerce-devanshu.herokuapp.com/#/saller') {
			$location.path('/saller');
			$location.replace();
		}
		if ($scope.role == 'customer' && url != 'https://ecommerce-devanshu.herokuapp.com/#/customer') {
			$location.path('/customer');
			$location.replace();
		}
	});

	//display all product related to that seller
	if ($scope.role == 'saller') {
		$http({
			url: '/displaysellerproduct',
			dataType: 'json',
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (response) {
			if (response.status == 0) {
				//alert("redirection");
				$location.path('/');
				$location.replace();
			}
			else {
				//alert("display data");
				$scope.names = response;
			}
		}).error(function (error) {
			//$location.path('/');
			//$location.replace();
		});
	}
	else {
		$http({
			url: '/allproduct',
			dataType: 'json',
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (response) {
			if (response.status == 0) {
				$location.path('/');
				$location.replace();
			}
			else
			{ $scope.names = response; }
		}).error(function (error) {
			//$location.path('/');
			//$location.replace();
		});
	}

	//Display User Profile
	$scope.findone = function () {

		$http({
			url: '/displayuser',
			dataType: 'json',
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (response) {
			$scope.uperson = response;

		}).error(function (error) {
			$scope.error = error;
		});
	};

	//update User
	$scope.updateuser = function (uperson) {

		$http({
			url: '/updateuser',
			dataType: 'json',
			data: uperson,
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (udata) {
			$scope.uperson = udata;

		}).error(function (error) {
			$scope.error = error;
		});
	};

	//Seller remove product
	$scope.deleteproduct = function (name) {

		$http({
			url: '/deleteproduct/' + name,
			method: 'delete',
			headers: {
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (response) {
			$scope.names = response;

			$scope.product = {};
		}).error(function (error) {
			$scope.error = error;
		});

	};

	//update remove product
	$scope.updateone = function (name) {

		$http({
			url: '/updateproduct/' + name,
			dataType: 'json',
			data: $scope.product1,
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (response) {
			$scope.names = response;
			$scope.names = response;
		}).error(function (error) {
			$scope.error = error;
		});

	};

	//update remove product
	$scope.findoneproduct = function (name) {

		$http({
			url: '/oneproduct/' + name,
			method: 'get',
			headers: {
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (response) {
			$scope.product1 = response;
			//$scope.product = {};
		}).error(function (error) {
			$scope.error = error;
		});

	};



	//Seller Add New Product
	$scope.addproduct = function (product) {

		$http({
			url: '/addproduct',
			dataType: 'json',
			method: 'POST',
			data: product,
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}

		}).success(function (response) {
			$scope.names = response;
			$scope.product = {};
		}).error(function (error) {
			$scope.error = error;
		});

	};


	$scope.logout = function () {
		localStorage.clear();
		localStorage.removeItem("Authoraization");
		$location.path('/');
		$location.replace();
	};

}

//mainController 
//Pages : login,signup,passwordreset
function mainController($scope, $http, $location, $window, $rootScope) {
	$scope.person = {};
	$scope.product = {};

	//whenever route change this event will occur
	//Purpouse : to blank all fields
	$rootScope.$on("$routeChangeSuccess", function (args) {
		$scope.person = {};
	})

	//Forgot Password Email sent
	$scope.forgotpassword = function (email) {
		$http({
			url: '/forgotpassword',
			dataType: 'json',
			method: 'POST',
			data: email,
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function (response, status) {
			$scope.resmessage = true;
			$scope.resmessage = "Mail successfully send on " + response.Success;
		}).error(function (error, status) {
			$scope.resmessage = true;
			$scope.resmessage = error.error;
		});
	}

	//SignUP new Customer
	$scope.saveCustomer = function (person) {

		let modal = document.getElementById('myModal');
		let span = document.getElementsByClassName("close")[0];
		document.getElementById('modal-content').style.width = '30%';
		let cbstatus;
		$http({
			url: '/signup',
			dataType: 'json',
			method: 'POST',
			data: person,
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function (response) {
			$scope.response = response.success;
			modal.style.display = "block";
			$scope.person = {};
		}).error(function (error, status) {
			$scope.response = error.error;
			modal.style.display = "block";
			cbstatus = status;
			status == 400 ? $scope.person.email = {} : $scope.person = {};
		});

		span.onclick = function () {
			modal.style.display = "none";
			if (cbstatus == 400)
				document.getElementById('txtemail').focus();
		}

	};

	//Login Customer
	$scope.logincust = function (person) {
		let modal = document.getElementById('myModal');
		let span = document.getElementsByClassName("close")[0];
		document.getElementById('modal-content').style.width = '30%';
		$http({
			url: '/login',
			dataType: 'json',
			method: 'POST',
			data: person,
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function (response, status) {
			if (status == 200) {
				localStorage.setItem('Authoraization', response.AuthToken);
				localStorage.setItem('username', response.uname);
				localStorage.setItem('urole', response.Role);

				if (response.Role == 'saller') {
					$location.path('/saller');
					$location.replace();
				}
				else if (response.Role == 'customer') {
					$location.path('/customer');
					$location.replace();
				}
			}
		}).error(function (error, status) {
			$scope.loginresponse = error.error;
			modal.style.display = "block";
			$scope.person = {};
		});

		span.onclick = function () {
			modal.style.display = "none";
		}
	};

	//Update password (LINK : forgotpassword)
	$scope.updatepassword = function (pwd) {
		let modal = document.getElementById('pwdmodel');
		let span = document.getElementsByClassName("close")[0];
		document.getElementById('modal-content').style.width = '50%';
		$http({
			url: '/reset/' + $location.search().token,
			dataType: 'json',
			method: 'PUT',
			data: pwd,
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function (response, status) {
			if (status == 200) {
				$scope.pwdreset = response.success;
				modal.style.display = "block";
				$scope.pwd = {};
			}
		}).error(function (error, status) {
			$scope.pwdreset = error.error;
			modal.style.display = "block";
			$scope.pwd = {};
		});

		span.onclick = function ($location) {
			modal.style.display = "none";
			$window.location.href  ='#/login';
		}
	}
}