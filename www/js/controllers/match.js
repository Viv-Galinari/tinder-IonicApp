'use strict';

// 'Uid' injected here comes from 'resolve' function we ran on app.js (under .state('app.match') to authentice user
app.controller('MatchCtrl', function(Match, Auth, uid, profile, $scope, Like, Messages, $ionicModal, $ionicScrollDelegate, $timeout) {
	
	var matc = this;
	// Function init to initialize match page each time with refreshed data (using Ionic eventListener)
	function init() {

		matc.list = [];

		// Get the loaded list of all matched users with ID as parameter and run a function on the data
		Match.allMatchesByUser(uid).$loaded().then(function(data) {
			for (var i = 0; i < data.length; i++) {
				var item = data[i];

				// From each matched user we get their ID from Auth and push their profile into an array
				Auth.getProfile(item.$id).$loaded().then(function(profile) {
					// Use that array into templates
					matc.list.push(profile);
				});
			}
		});
	};

	// Event listener to listen for page's update
	$scope.$on('$ionicView.enter', function(e) {
		init();
	});

	// Function to unmatch users
	matc.unmatch = function(matchUid) {
		Like.removeLike(uid, matchUid);
		Match.removeMatch(uid, matchUid);

		// Call init to refresh data
		init();
	};

})
