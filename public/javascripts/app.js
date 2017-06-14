
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
			$window.location.href = '#/login';
		}
	}
}