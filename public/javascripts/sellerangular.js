function sellercontroller($scope, $http, $location, $rootScope, $log) {

	//Event function to display sellerproduct
	$scope.$on('displaysellerproduct', function () {
		$http({
			url: '/displaysellerproduct',
			dataType: 'json',
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}
		}).success(function (response) {
			$scope.nodoc = false;
			$scope.names = response.success;
		}).error(function (error) {
			$scope.nodoc = true;
			$scope.nodocument = error.error;
		});
	});

	//Event function display allproduct for customer
	$scope.$on('displayallproduct', function () {
		$http({
			url: '/allproduct',
			dataType: 'json',
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}
		}).success(function (response) {
			$scope.nodoc = false;
			$scope.names = response.success;
		}).error(function (error) {
			$scope.nodoc = true;
			$scope.nodocument = error.error;
		});
	});

	//get the name of the current logged user from localstorage
	$scope.uname = localStorage.getItem('username');
	$scope.role = localStorage.getItem('urole');
	$scope.product = {};
	$(document).ready(function () {
		var url = window.location.href;
		if ($scope.role == 'saller' && url != 'https://ecommerce-devanshu.herokuapp.com/#/saller') {
			$location.path('/saller');
			$location.replace();
			$scope.$emit('displaysellerproduct');
		}
		if ($scope.role == 'customer' && url != 'https://ecommerce-devanshu.herokuapp.com/#/customer') {
			$location.path('/customer');
			$location.replace();
			$scope.$emit('displayallproduct');
		}
	});

	//Seller Add New Product
	$scope.addproduct = function (product) {
		//Supported file formates
		var types = ['jpg', 'png', 'jpeg'];
		$log.log(product.filedata.filetype.split("/")[1]);
		//check image filesize
		if (product.filedata.filesize > 50000 || product.filedata.filesize < 10000) {
			$scope.imageerr = true;
			$scope.imageerror = 'File size is too large,File size between 10MB to 50MB';
			return;
		}
		//check image type
		if (types.indexOf(product.filedata.filetype.split("/")[1]) == -1) {
			$scope.imageerr = true;
			$scope.imageerror = "File must be in a 'JPEG,JPG & PNG' Format";
			return;
		}
		$scope.imageerr = false;
		$http({
			url: '/addproduct',
			dataType: 'json',
			method: 'POST',
			data: product,
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}
		}).success(function (response, status) {
			if (status === 201) {
				$scope.$emit('displaysellerproduct');
				$scope.product = {};
			}
		}).error(function (error) {
			$scope.error = error;
		});

	};

	//update seller product information
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
		}).success(function (response, status) {
			$scope.names = response.success;
		}).error(function (error) {
			
		});
	};

	//Display User Profile
	$scope.findone = function () {
		$scope.$apply(function () {
			alert("data")
			$scope.userupdate = false;
		})
		$http({
			url: '/displayuser',
			dataType: 'json',
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authoraization": localStorage.getItem("Authoraization")
			}
		}).success(function (response, status) {
			if (status === 200) {
				$scope.uperson = response.success;
			}
		}).error(function (error) {
			$scope.userupdate = true;
			$scope.userprof = error.error;
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
		}).success(function (udata, status) {
			if (status === 200) {
				$scope.userupdate = true;
				$scope.userprof = 'Updated successfully';
				$scope.uperson = udata.success;
			}
		}).error(function (error) {
			$scope.userupdate = true;
			$scope.userprof = error.error;
		});
	};

	//Seller delete product
	$scope.deleteproduct = function (name) {
		$http({
			url: '/deleteproduct/' + name,
			method: 'delete',
			headers: {
				"Authoraization": localStorage.getItem("Authoraization")
			}
		}).success(function (response) {
			$scope.names = response.success;

			$scope.product = {};
		}).error(function (error) {
			$scope.error = error;
		});

	};

	//find only one product
	$scope.findoneproduct = function (name) {
		$http({
			url: '/oneproduct/' + name,
			method: 'get',
			headers: {
				"Authoraization": localStorage.getItem("Authoraization")
			}
		}).success(function (response) {
			$scope.product1 = response.success;
			//$scope.product = {};
		}).error(function (error) {
			$scope.error = error;
		});

	};

	//logout user 
	$scope.logout = function () {
		localStorage.clear();
		localStorage.removeItem("Authoraization");
		$location.path('/');
		$location.replace();
	};
}