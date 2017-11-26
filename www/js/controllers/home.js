'use strict';

// inject all these functions in the brakets into function
app.controller('HomeCtrl', function(Auth, $ionicLoading, $ionicModal, $scope, Like, Match, uid) {

	var home = this;
	// This variable allows us to calculate the index of current user profile card
	home.currentIndex = null;
	// This variable allow us to get the id of current user liked
	// We use home.VariableName format as we're using this variable on the template 
	// Otherwise we could simply write it (var =)
	home.currentCardUid = null;

	var maxAge = null;
	var men = null;
	var women = null;
	// Update user's profile with current likes
	var currentUid = uid;

	// Inject a loading sign into the app to indicate it's 'loading...'
	$scope.show = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="bubbles"></ion-spinner>'
		});
	};

	$scope.hide = function() {
		$ionicLoading.hide();
	}


	function init() {

		$scope.show();

		home.profiles = [];

		// get items from local storage
		maxAge = JSON.parse(window.localStorage.getItem('maxAge')) || 25;

		men = JSON.parse(window.localStorage.getItem('men'));
		men = men === null? true : men;

		women = JSON.parse(window.localStorage.getItem('women'));
		women = women === null? true : women;

		// Grab the list first of all users. Then filter it by gender
		Auth.getProfilesByAge(maxAge).$loaded().then(function(data) {
			for (var i = 0; i < data.length; i++) {
				var item = data[i];

				// if conditions are certified, return it to client. (push it to server)
				if ((item.gender == 'male' && men) || (item.gender == 'female' && women)) {
					// if item (user) is not equal current push item  (remove current user from list of users to like)
					if (item.$id != currentUid)
						home.profiles.push(item);
				}
			}

			// Use a filter from Underscore library to look through every single object of array comparing users ids
			// and filtering all duplicated records from AllLidesByUser function hosted on like.js page
			Like.allLikesByUser(currentUid).$loaded().then(function(likesList) {
				home.profiles = _.filter(home.profiles, function(obj) {
					return _.isEmpty(_.where(likesList, {$id: obj.$id}));
				});
			});

			// This if statement calculates the index of current user profile card
			if (home.profiles.length > 0) {
				home.currentIndex = home.profiles.length - 1;
				// By using this bellow, we will know what's the user's current ID from index updating cards when swipping 
				home.currentCardUid = home.profiles[home.currentIndex].$id;
			}

			$scope.hide();
		});
	};

	// Ionic tries to maximaze mobile experience by refrain from refreshing the page
	// set up an eventListener to hear when changes on page happens and act on it
	$scope.$on('$ionicView.enter', function(e) {
		init();
	});

	// This create functions for our likes events
	// If user swipe left, card is removed and display NOPE
	// Pass the (index) or all users as argument
	home.nope = function(index) {
		home.cardRemoved(index);
		console.log('NOPE');
	};
	
	// Using two parameters to update new likes
	// When user likes another user from the list, this function will add the new liked Id to current user
	// We use currentUid variable to update user's profile with new likes
	home.like = function(index, like_uid) {
		Like.addLike(currentUid, like_uid);
		// Updated like function new chains from match.js
		Match.checkMatch(currentUid, like_uid);
		home.cardRemoved(index);
		console.log('LIKE');
	};

	// Pass Index as parameter and remove item from index position
	home.cardRemoved = function(index) {
		home.profiles.splice(index, 1);

		if (home.profiles.length > 0) {
			home.currentIndex = home.profiles.length - 1;
			home.currentCardUid = home.profiles[home.currentIndex].$id;
		}
	};

	// Function to create a modal displaying user's info
	$ionicModal.fromTemplateUrl('templates/info.html', {
		scope: $scope
	})
	.then(function(modal) {
		$scope.modal = modal;
	});

	// get users info into model direct from tinder card
	home.openModal = function() {
		home.info = Auth.getProfile(home.currentCardUid);
		$scope.modal.show();
	};

	home.closeModal = function() {
		$scope.modal.hide();
	};

});